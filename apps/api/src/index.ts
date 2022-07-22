import express from "express";
import "dotenv/config";
import user from "./routes/user";
import notification from "./routes/notification";
import auth from "./routes/auth";
import webhook from "./routes/webhook";
import { handleError, logError } from "./middlewares";
import { expressjwt } from "express-jwt";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

const app = express();
const port = process.env.PORT ?? 8080;

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({
      app,
    }),
  ],
  tracesSampleRate: 0.75,
});

// Middlewares
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(express.json());
app.use(
  "/user",
  expressjwt({
    secret: process.env.JWT_ACCESS_SECRET!,
    algorithms: ["HS256"],
  })
);

// Routes
app.use("/user", user);
app.use("/notification", notification);
app.use("/", auth);
app.use("/", webhook);
app.get("/health", (_req, res) => res.send("OK"));

// Error handling
app.use(Sentry.Handlers.errorHandler());
app.use(logError);
app.use(handleError);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
