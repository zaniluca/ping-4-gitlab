import * as jwt from "jsonwebtoken";
import * as Sentry from "@sentry/cloudflare";
import type { CustomJWTClaims, Headers } from "./types";
import type { DrizzleClient } from "../db/client";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const getAccessToken = (payload: CustomJWTClaims, secret: string) => {
  return jwt.sign(payload, secret, {
    expiresIn: "1h",
  });
};

export const getRefreshToken = (uid: string, secret: string) => {
  return jwt.sign(
    {
      uid,
    },
    secret,
    {
      expiresIn: "60d",
    }
  );
};

export const getTokenPayload = (token: string) => {
  try {
    return jwt.decode(token) as CustomJWTClaims;
  } catch (e) {
    throw new Error("Invalid token");
  }
};

export const parseHeaders = (headers: string) => {
  let json: Record<string, string> = {};
  const sanitized = headers.trimEnd().replace(/[']+/g, "").split("\n");

  sanitized.map((e) => {
    let elements = e.split(": ");
    if (elements.length > 2) return;
    json[elements[0].trim().toLocaleLowerCase()] = elements[1];
  });

  return json as Headers;
};

export const updateLastLogin = async (id: string, db: DrizzleClient) => {
  try {
    await db
      .update(users)
      .set({
        lastLogin: new Date(),
      })
      .where(eq(users.id, id));
  } catch (error) {
    Sentry.captureException(error);
    console.error(error);
  }
};
