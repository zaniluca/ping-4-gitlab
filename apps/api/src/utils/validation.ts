import { z } from "zod";

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[a-z]/, "Must contain at least one lowercase character")
  .regex(/[A-Z]/, "Must contain at least one uppercase character")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[!@#%&]/, "Must contain at least one special character");

export const signupBodySchema = z.object({
  email: z.email("Invalid email address"),
  password: passwordSchema,
});

export const loginBodySchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const refreshBodySchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const userUpdateBodySchema = z.object({
  email: z.email("Invalid email address").optional(),
  password: passwordSchema.optional(),
  expoPushTokens: z.array(z.string()).optional(),
  mutedUntil: z.coerce
    .date()
    .min(new Date(), "Date must be in the future")
    .nullable()
    .optional(),
});

export const notificationUpdateBodySchema = z.object({
  viewed: z.boolean().optional(),
});

export const notificationListQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
});
