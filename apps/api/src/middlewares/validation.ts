import { ValidationTargets } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ZodSchema } from "zod";

export const validate = <
  Target extends keyof ValidationTargets,
  T extends ZodSchema,
>(
  target: Target,
  schema: T,
) =>
  zValidator(target, schema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          message: result.error.issues[0]?.message || "Validation failed",
        },
        400,
      );
    }
  });
