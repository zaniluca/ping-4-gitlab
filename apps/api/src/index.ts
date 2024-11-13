import "dotenv/config";
import "./utils/sentry"; // Must be imported before other files
import express from "express";
import user from "./routes/user";
import notification from "./routes/notification";
import oauth from "./routes/oauth";
import auth from "./routes/auth";
import webhook from "./routes/webhook";
import {
  attachSentryUserInfo,
  handleError,
  logError,
  requestLogger,
} from "./middlewares";
import { expressjwt } from "express-jwt";
import * as Sentry from "@sentry/node";
import { oldNotificationDeletionCron } from "./crons";

const app = express();
const port = process.env.PORT ?? 8080;

app.enable("trust proxy");

// Middlewares
app.use(requestLogger);
app.use(attachSentryUserInfo);
app.use(express.json());
app.use(
  "/user",
  expressjwt({
    secret: process.env.JWT_ACCESS_SECRET!,
    algorithms: ["HS256"],
  })
);
app.use(
  "/notification",
  expressjwt({
    secret: process.env.JWT_ACCESS_SECRET!,
    algorithms: ["HS256"],
  })
);

// Routes
app.use("/user", user);
app.use("/oauth", oauth);
app.use("/notification", notification);
app.use("/", auth);
app.use("/", webhook);
app.get("/health", (_req, res) => res.send("OK"));
app.get("/account-deletion-info", (_req, res) =>
  res.send(
    "If you want to get your account deleted you can either enter the app and delete your account in the settings screen or send an email to support@zaniluca.com with the subject 'Delete my account' along with the credentials you used to sign up."
  )
);
// Error handling
Sentry.setupExpressErrorHandler(app, {
  shouldHandleError: (error) => {
    if (error.statusCode && error.statusCode < 500) {
      return false;
    }
    return true;
  },
});
app.use(logError);
app.use(handleError);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    oldNotificationDeletionCron.start();
  });
}

export default app;
