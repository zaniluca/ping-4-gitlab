import express from "express";
import "dotenv/config";
import user from "./routes/user";
import notification from "./routes/notification";
import oauth from "./routes/oauth";
import auth from "./routes/auth";
import webhook from "./routes/webhook";
import { handleError, logError, requestLogger } from "./middlewares";
import { expressjwt } from "express-jwt";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

const app = express();
const port = process.env.PORT ?? 8080;

app.enable("trust proxy");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  debug: process.env.NODE_ENV === "development",
  enabled: process.env.NODE_ENV === "production",
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({
      app,
    }),
  ],
  tracesSampleRate: 1, // TODO: lower it once test are completed
});

// Middlewares
// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(requestLogger);
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

// Error handling
app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError: (error) => error.status === 500,
  })
);
app.use(logError);
app.use(handleError);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

export default app;
