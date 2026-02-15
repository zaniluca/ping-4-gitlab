import { jwt } from "hono/jwt";
import { createMiddleware } from "hono/factory";
import * as Sentry from "@sentry/cloudflare";
import { AppEnv } from "../utils/types";

const jwtAuth = createMiddleware<AppEnv>(async (c, next) => {
  const jwtMiddleware = jwt({ secret: c.env.JWT_ACCESS_SECRET });
  return jwtMiddleware(c, next);
});

const attachUserInfo = createMiddleware<AppEnv>(async (c, next) => {
  const payload = c.get("jwtPayload");
  const logger = c.get("logger");

  if (payload?.uid) {
    logger.assign({
      user: {
        id: payload.uid as string,
        hookId: payload.hookId as string,
      },
    });

    Sentry.setUser({
      id: payload.uid as string,
      username: payload.hookId as string,
    });
  }

  await next();
});

export const authRequired = [jwtAuth, attachUserInfo];
