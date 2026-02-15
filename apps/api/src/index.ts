import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as Sentry from "@sentry/cloudflare";
import { crons } from "./crons";
import auth from "./routes/auth";
import user from "./routes/user";
import notification from "./routes/notification";
import oauth from "./routes/oauth";
import webhook from "./routes/webhook";
import { AppEnv } from "./utils/types";
import { getDrizzleClient } from "./db/client";
import { requestId } from "hono/request-id";
import { authRequired } from "./middlewares/auth";
import { loggerMiddleware, wideLoggingMiddleware } from "./middlewares/logging";

const app = new Hono<AppEnv>();

// Global middlewares
app.use(requestId());
app.use(loggerMiddleware, wideLoggingMiddleware);
app.use(async (c, next) => {
  c.set("db", getDrizzleClient(c.env.DB));
  await next();
});

// Global error handler
app.onError((err, c) => {
  const logger = c.get("logger");

  logger.assign({
    outcome: "error",
  });

  if (err instanceof HTTPException) {
    const status = err.status;

    if (status >= 500) {
      if (c.env.ENVIRONMENT === "test") {
        return c.json({ message: "I'm in test mode" }, 500);
      }
      // Log stack trace for server errors
      logger.assign({
        error: {
          type: "HTTPException",
          message: err.message,
          statusCode: status,
          stack: err.stack,
        },
      });

      logger.error(err.message);
      Sentry.captureException(err);
      return c.json({ message: "Oops! Something went wrong" }, status);
    } else {
      logger.assign({
        error: {
          type: "HTTPException",
          message: err.message,
          statusCode: status,
        },
      });

      logger.warn(err.message);
      return c.json({ message: err.message }, status);
    }
  }

  logger.assign({
    error: {
      type: err.name,
      message: err.message,
      stack: err.stack,
    },
  });

  logger.error(err.message);
  Sentry.captureException(err);
  return c.json({ message: "Oops! Something went wrong" }, 500);
});

// Public routes
app.route("/", auth);
app.route("/oauth", oauth);
app.route("/", webhook);
app.get("/health", (c) => c.text("OK"));
app.get("/account-deletion-info", (c) =>
  c.text(
    "If you want to get your account deleted you can either enter the app and delete your account in the settings screen or send an email to support@zaniluca.com with the subject 'Delete my account' along with the credentials you used to sign up.",
  ),
);

// Protected routes
const protectedUser = new Hono<AppEnv>();
protectedUser.use("*", ...authRequired);
protectedUser.route("/", user);

const protectedNotification = new Hono<AppEnv>();
protectedNotification.use("*", ...authRequired);
protectedNotification.route("/", notification);

app.route("/user", protectedUser);
app.route("/notification", protectedNotification);

// 404 handler
app.notFound(() => {
  throw new HTTPException(404, { message: "Not Found" });
});

export const testApp = app;

const withSentry = Sentry.withSentry<AppEnv["Bindings"]>((env) => {
  return {
    dsn: env.SENTRY_DSN,
    release: env.SENTRY_RELEASE,
    sendDefaultPii: true,
    enabled: env.ENVIRONMENT === "production",
    tracesSampleRate: 0.05,
    profilesSampleRate: 0.05,
    // This env should be implicitly used by the SDK but let's make it explicit
    environment: env.SENTRY_ENVIRONMENT,
    beforeSendTransaction(event) {
      // Remove the cursor from the transaction
      event.transaction = event.transaction?.replace(
        /cursor=\w+/,
        "cursor={cursor}",
      );

      // Remove the notification id after /notification/ from the transaction
      event.transaction = event.transaction?.replace(
        /\/notification\/\w+\d+/,
        "/notification/{id}",
      );

      return event;
    },
  };
}, app);

export default {
  fetch: withSentry.fetch,
  scheduled: crons,
};
