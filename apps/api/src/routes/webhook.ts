import { Hono } from "hono";
import type {
  AppEnv,
  Headers,
  PipelineStatus,
  WebhookPayload,
} from "../utils/types";
import hash from "object-hash";
import { notifications, users } from "../db/schema";
import type { Notification, User } from "../db/schema";
import { Expo, ExpoPushMessage } from "expo-server-sdk";
import { parseHeaders } from "../utils/common";
import { HTTPException } from "hono/http-exception";
import * as Sentry from "@sentry/cloudflare";
import { APP_URL_SCHEME } from "../utils/constants";
import { eq, count, and } from "drizzle-orm";
import { env } from "cloudflare:workers";

const webhook = new Hono<AppEnv>();

const expo = new Expo({
  accessToken: env.EXPO_ACCESS_TOKEN,
  useFcmV1: true,
});

const removeFooterFromHtml = (html?: string) => {
  const FOOTER_REGEX = /<div\b[^>]*class="footer"[^>]*>([\s\S]*?)<\/div>/;
  return html?.replace(FOOTER_REGEX, "") ?? "<p>No Content</p>";
};

const isValidToken = (t: string) => {
  if (Expo.isExpoPushToken(t)) return t;
  console.error(`Push token ${t} is not a valid Expo push token`);
  return;
};

type NotificationWithHeaders = Notification & {
  headers: Headers;
};

const composePipelineNotification = (n: NotificationWithHeaders) => {
  const status = n.headers["x-gitlab-pipeline-status"];
  const STATUS_TITLE: Record<PipelineStatus, string> = {
    success: "Pipeline Succeded!",
    failed: "Pipeline Failed!",
  };

  return {
    title: status ? STATUS_TITLE[status] : "Pipeline",
    body: n.subject,
  };
};

const composeNotificationContent = (n: NotificationWithHeaders) => {
  const isPipeline = !!n.headers["x-gitlab-pipeline-id"];

  if (isPipeline) {
    return composePipelineNotification(n);
  }

  const title = sanitizeSubject(n.subject);
  const body = n.text?.split("\n")[0].trim();

  return {
    title,
    body: body ?? "You have a new notification!",
  };
};

const sanitizeText = (text?: string) => {
  return text?.trimStart()?.split("--")?.[0] ?? "No Text";
};

const sanitizeSubject = (subject: string) => {
  const STRING_BEFORE_FIRST_PIPE_REGEX = /^[^\|]*\|/;
  return subject.replace(STRING_BEFORE_FIRST_PIPE_REGEX, "").trimStart();
};

webhook.post("/webhook", async (c) => {
  const logger = c.get("logger");
  const posthog = c.get("posthog");
  const token = c.req.query("token");

  if (!token || token !== c.env.WEBHOOK_SECRET) {
    throw new HTTPException(403, { message: "Unauthorized" });
  }

  try {
    const formData = await c.req.parseBody();

    const payload: WebhookPayload = {
      to: formData.to as string,
      subject: formData.subject as string,
      text: formData.text as string | undefined,
      html: formData.html as string | undefined,
      headers: formData.headers as string,
    };

    if (!payload.headers || !payload.to || !payload.subject) {
      console.warn("Webhook payload is missing some fields", payload);
      Sentry.captureEvent({
        message: "Webhook payload is missing some fields",
        extra: payload,
      });
      throw new HTTPException(400, {
        message: "Webhook payload is missing some fields",
      });
    }

    const {
      to,
      subject: rawSubject,
      text: rawText,
      html: rawHtml,
      headers: rawHeaders,
    } = payload;

    const headers = parseHeaders(rawHeaders);
    const text = sanitizeText(rawText);
    const html = removeFooterFromHtml(rawHtml);
    const subject = sanitizeSubject(rawSubject);

    const hashPayload = { subject, text, html, to };
    const hookId = to.split("@")[0];
    const contentHash = hash(hashPayload);

    let user: User;
    const foundUser = await c.var.db
      .select()
      .from(users)
      .where(eq(users.hookId, hookId))
      .get();

    if (!foundUser) {
      throw new HTTPException(400, {
        message: `User with hook ${hookId} doesn't exist`,
      });
    }
    user = foundUser;

    let notification: Notification;
    try {
      const existingNotification = await c.var.db
        .select()
        .from(notifications)
        .where(
          and(
            eq(notifications.userId, user.id),
            eq(notifications.contentHash, contentHash),
          ),
        )
        .get();

      if (existingNotification) {
        throw new HTTPException(409, { message: "Duplicate notification" });
      }

      const newNotification = await c.var.db
        .insert(notifications)
        .values({
          subject,
          text,
          html,
          headers,
          contentHash,
          userId: user.id,
        })
        .returning()
        .get();

      notification = newNotification;
    } catch (e) {
      if (e instanceof HTTPException) throw e;
      Sentry.captureException(e);
      throw new HTTPException(500, { message: "Internal Server Error" });
    }

    const [{ value: notificationsCount }] = await c.var.db
      .select({ value: count() })
      .from(notifications)
      .where(eq(notifications.userId, user.id));

    const isFirstNotification =
      !user.onboardingCompleted && notificationsCount > 0;

    if (isFirstNotification) {
      logger.setMsg("First notification received, Onboarding completed");
      const updatedUser = await c.var.db
        .update(users)
        .set({ onboardingCompleted: true })
        .where(eq(users.id, user.id))
        .returning()
        .get();
      user = updatedUser;

      posthog.capture({
        distinctId: user.id,
        event: "onboarding_completed",
      });
    }

    posthog.capture({
      distinctId: user.id,
      event: "notification_received",
    });

    if (user.mutedUntil && user.mutedUntil > new Date()) {
      logger.setMsg(
        `User is muted until ${user.mutedUntil}, skipping notification.`,
      );
      return c.json(
        {
          message: `User is muted until ${user.mutedUntil}, skipping notification.`,
        },
        200,
      );
    }

    const pushTokens = user.expoPushTokens.filter(isValidToken);

    if (pushTokens.length === 0) {
      throw new HTTPException(400, {
        message: "User doesn't have any valid token",
      });
    }
    logger.assign({ notification });

    const notificationPayload: ExpoPushMessage = {
      to: pushTokens,
      sound: "default",
      channelId: "default",
      ...composeNotificationContent(notification as NotificationWithHeaders),
      data: {
        nid: notification.id,
        url: `${APP_URL_SCHEME}notifications/${notification.id}`,
      },
    };

    logger.assign({ pushNotificationPayload: notificationPayload });

    if (notificationsCount === 1) {
      notificationPayload.title = "Welcome to Ping for Gitlab!";
      notificationPayload.body =
        "You succesfully connected to Gitlab! come back to the app to complete the onboarding process";
    }

    const chunks = expo.chunkPushNotifications([notificationPayload]);

    let receiptIds = [];
    for (const chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);

        for (let ticket of ticketChunk) {
          if (ticket.status === "ok") {
            receiptIds.push(ticket.id);
          } else {
            if (ticket.details && ticket.details.error) {
              console.error(`Push ticket error: ${ticket.message}`);
              Sentry.captureException(
                new Error(`Push ticket error: ${ticket.message}`),
                {
                  extra: {
                    ticket_details: ticket.details,
                    notification_payload: notificationPayload,
                  },
                },
              );

              if (
                ticket.details &&
                ticket.details.error &&
                ticket.details.error === "DeviceNotRegistered"
              ) {
                console.warn(
                  `Invalid push token detected: ${ticket.details.expoPushToken}`,
                );
              }
            }
          }
        }
      } catch (error) {
        console.error("Error sending push notification chunk", error);
        Sentry.captureException(error, {
          extra: {
            chunk_size: chunk.length,
            notification_payload: notificationPayload,
          },
        });
      }
    }

    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);

        for (const [receiptId, receipt] of Object.entries(receipts)) {
          if (receipt.status === "ok") {
            continue;
          } else if (receipt.status === "error") {
            console.error(
              `There was an error sending a notification: ${receipt.message}`,
            );
            Sentry.captureException(
              new Error(`Push receipt error: ${receipt.message}`),
              {
                extra: {
                  receipt_id: receiptId,
                  receipt_details: receipt.details,
                },
              },
            );

            if (receipt.details && receipt.details.error) {
              console.error(`Push receipt error: ${receipt.details.error}`);
            }
          }
        }
      } catch (error) {
        console.error("Error checking receipts:", error);
        Sentry.captureException(error, {
          extra: { receipt_ids: chunk },
        });
      }
    }

    return c.text("OK", 200);
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    Sentry.captureException(error);
    throw new HTTPException(500, { message: "Internal server error" });
  }
});

export default webhook;
