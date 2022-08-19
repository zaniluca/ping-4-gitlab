import * as Yup from "yup";
import * as jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import type { ObjectShape } from "yup/lib/object";

type ObjectShapeValues = ObjectShape extends Record<string, infer V>
  ? V
  : never;

type Shape<T extends Record<any, any>> = Partial<
  Record<keyof T, ObjectShapeValues>
>;

const PasswordSchema = Yup.string()
  .min(6)
  .matches(/^(?=.*[a-z])/, "Must contain at least one lowercase character")
  .matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase character")
  .matches(/^(?=.*[0-9])/, "Must contain at least one number")
  .matches(/^(?=.*[!@#%&])/, "Must contain at least one special character");

export const SignupBodySchema = Yup.object({
  email: Yup.string().email().required().label("Email"),
  password: PasswordSchema.required().label("Password"),
});

export const LoginBodySchema = Yup.object({
  email: Yup.string().email().required().label("Email"),
  password: Yup.string().required().label("Password"),
});

export const RefreshBodySchema = Yup.object({
  refreshToken: Yup.string()
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

export const UserUpdateBodySchema = Yup.object<Shape<User>>({
  email: Yup.string().email(),
  password: PasswordSchema,
  expoPushTokens: Yup.array().of(Yup.string()),
  mutedUntil: Yup.date().min(new Date()),
});
