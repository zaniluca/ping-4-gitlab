import { getLogger } from "../utils/logger";
import { AppEnv } from "../utils/types";
import { createMiddleware } from "hono/factory";

export const loggerMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const logger = getLogger(c.env);
  c.set("logger", logger);

  await next();
});

export const wideLoggingMiddleware = createMiddleware<AppEnv>(
  async (c, next) => {
    const startTime = Date.now();
    const logger = c.get("logger");

    logger.assign({
      headers: c.req.header(),
      requestId: c.get("requestId"),
      timestamp: new Date().toISOString(),
      method: c.req.method,
      path: c.req.path,
      service: "api",
      version: c.env.SENTRY_RELEASE || "unknown",
    });

    await next();

    logger.assign({
      durationMs: Date.now() - startTime,
    });

    if (logger.bindings().outcome === "error") {
      // Log has already been handled in error middleware
      return;
    }
    logger.assign({
      statusCode: c.res.status,
      outcome: "success",
    });

    if (!logger.bindings().msg) {
      logger.info(`${c.req.method} ${c.req.path}`);
    } else {
      // A custom message is already set
      logger.info({});
    }
  },
);
