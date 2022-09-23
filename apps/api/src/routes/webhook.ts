import { Router } from "express";
import type { Headers, PipelineStatus, WebhookPayload } from "../utils/types";
import hash from "object-hash";
import prisma from "../../prisma/client";
import type { Notification, User } from "@prisma/client";
import multer from "multer";
import { Expo, ExpoPushMessage } from "expo-server-sdk";
import { parseHeaders } from "../utils/common";
import { ErrorWithStatus } from "../utils/errors";

const router = Router();

// optionally providing an access token if you have enabled push security
const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

const removeFooterFromHtml = (html: string) => {
  const FOOTER_REGEX = /<div\b[^>]*class="footer"[^>]*>([\s\S]*?)<\/div>/;
  return html.replace(FOOTER_REGEX, "");
};

const isValidToken = (t: string) => {
  if (Expo.isExpoPushToken(t)) return t;
  console.error(`Push token ${t} is not a valid Expo push token`);
  return;
};

type NotificationWithHeaders = Notification & {
  headers: Headers;
};

const composeGenericNotification = (n: NotificationWithHeaders) => ({
  title: n.subject
    .replace(`Re: ${n.headers["x-gitlab-project"]} | `, "")
    .trimStart(),
});

const composePipelineNotification = (n: NotificationWithHeaders) => {
  const status = n.headers["x-gitlab-pipeline-status"];
  const STATUS_TITLE: Record<PipelineStatus, string> = {
    success: "Pipeline Succeded!",
    failed: "Pipeline Failed!",
  };

  return {
    title: status ? STATUS_TITLE[status] : "Pipeline",
    body: n.subject
      .replace(`${n.headers["x-gitlab-project"]} | `, "")
      .trimStart(),
  };
};

const composeNotificationContent = (n: NotificationWithHeaders) => {
  // We treat a notification as generic if it doesn't have a project associated
  const isGeneric = !n.headers["x-gitlab-project"];
  const isPipeline = !!n.headers["x-gitlab-pipeline-id"];

  if (isGeneric) {
    return composeGenericNotification(n);
  }

  if (isPipeline) {
    return composePipelineNotification(n);
  }

  const title = n.subject
    // Removing "Re: 'project-name'" used normally for emails
    .replace(`Re: ${n.headers["x-gitlab-project"]} | `, "")
    .trimStart();

  const body = n.text?.split("\n")[0].trim();
  return {
    title,
    body: body ?? "You have a new notification!",
  };
};

const sanitizeText = (text: string) => {
  // Removing "Reply to this email..."
  //https://stackoverflow.com/a/56391193/12661017
  // return text.trimStart().replace(/-- .*/g, "$'");
  return text.trimStart().split("--")[0];
};

router.post("/webhook", multer().none(), async (req, res, next) => {
  const { token } = req.query;

  if (!token || token !== process.env.WEBHOOK_SECRET) {
    return next(new ErrorWithStatus(403, "Unauthorized"));
  }

  const body = req.body as WebhookPayload;

  if (!body) {
    console.error("Failed to parse body", body);
    res.status(500);
    return;
  }

  const {
    to,
    subject,
    text: rawText,
    html: rawHtml,
    headers: rawHeaders,
  } = body!;

  // Parsing headers string into object
  const headers = parseHeaders(rawHeaders);

  // Removing unwanted parts from text
  // But also keeping original
  const text = sanitizeText(rawText);

  // Removing unwanted parts from html
  const html = removeFooterFromHtml(rawHtml);

  const hashPayload = {
    subject,
    text,
    html,
    to,
  };

  const hookId = to.split("@")[0];
  const contentHash = hash(hashPayload);

  let user: User;
  try {
    user = await prisma.user.findUniqueOrThrow({
      where: {
        hookId,
      },
    });
  } catch (error) {
    console.warn(`User with hook ${hookId} doesn't exist`);
    return next(
      new ErrorWithStatus(400, `User with hook ${hookId} doesn't exist`)
    );
  }

  let notification: Notification;
  try {
    notification = await prisma.notification.create({
      data: {
        subject,
        text,
        html,
        headers,
        contentHash,
        userId: user.id,
      },
    });
  } catch (error) {
    console.error("Failed to create notification", error);
    res.status(400).end();
    return;
  }

  const notificationsCount = await prisma.notification.count();

  if (!user.onboardingCompleted && !!notificationsCount) {
    console.log("First notification recived, Onboarding completed");

    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        onboardingCompleted: true,
      },
    });
  }

  if (user.mutedUntil && user.mutedUntil > new Date()) {
    console.log("User is muted until", user.mutedUntil);
    return res.status(200).end();
  }

  const pushTokens = user.expoPushTokens.filter(isValidToken);

  if (pushTokens.length === 0) {
    console.warn("User doesn't have any valid token");
    return next(new ErrorWithStatus(400, "User doesn't have any valid token"));
  }

  const notificationPayload: ExpoPushMessage = {
    to: pushTokens,
    sound: "default",
    ...composeNotificationContent(notification as NotificationWithHeaders),
    data: { nid: notification.id },
  };

  if (notificationsCount === 1) {
    notificationPayload.title = "Welcome to Ping for Gitlab!";
    notificationPayload.body =
      "You succesfully connected to Gitlab! come back to the app to complete the onboarding process";
  }

  const chunks = expo.chunkPushNotifications([notificationPayload]);

  for (const chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error) {
      console.error(error);
    }
  }

  res.status(200).end();
});

export default router;
