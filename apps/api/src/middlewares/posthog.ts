import { PostHog } from "posthog-node";
import type { MiddlewareHandler } from "hono";
import type { AppEnv } from "../utils/types";

export const posthogMiddleware: MiddlewareHandler<AppEnv> = async (c, next) => {
  const isProduction = c.env.ENVIRONMENT === "production";

  const client = new PostHog(c.env.POSTHOG_PROJECT_TOKEN ?? "disabled", {
    host: "https://eu.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
    disabled: !c.env.POSTHOG_PROJECT_TOKEN || !isProduction,
  });

  c.set("posthog", client);
  await next();

  c.executionCtx.waitUntil(client.shutdown());
};
