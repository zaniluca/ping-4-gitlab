import * as yup from "yup";
import * as jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import type { ObjectShape } from "yup/lib/object";

type ObjectShapeValues = ObjectShape extends Record<string, infer V>
  ? V
  : never;

type Shape<T extends Record<any, any>> = Partial<
  Record<keyof T, ObjectShapeValues>
>;

const PasswordSchema = yup
  .string()
  .min(6)
  .matches(/^(?=.*[a-z])/, "Must contain at least one lowercase character")
  .matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase character")
  .matches(/^(?=.*[0-9])/, "Must contain at least one number")
  .matches(/^(?=.*[!@#%&])/, "Must contain at least one special character");

export const SignupBodySchema = yup.object({
  email: yup.string().email().required().label("Email"),
  password: PasswordSchema.required().label("Password"),
});

export const LoginBodySchema = yup.object({
  email: yup.string().email().required().label("Email"),
  password: yup.string().required().label("Password"),
});

export const RefreshBodySchema = yup.object({
  refreshToken: yup
    .string()
    .required()
    .test("is-valid-refresh-token", "Invalid refresh token", (value) => {
      try {
        jwt.decode(value!);
        return !!jwt.verify(value!, process.env.JWT_REFRESH_SECRET!);
      } catch (e) {
        return false;
      }
    }),
});

export const UserUpdateBodySchema = yup.object<Shape<User>>({
  email: yup.string().email(),
  password: PasswordSchema,
  expoPushTokens: yup.array().of(yup.string()),
  mutedUntil: yup.date().min(new Date()).nullable(),
});
