import * as jwt from "jsonwebtoken";
import type { CustomJWTClaims, Headers } from "./types";
import prisma from "../../prisma/client";

export const getAccessToken = (uid: string) => {
  return jwt.sign(
    {
      uid,
    },
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: "1h",
    }
  );
};

export const getRefreshToken = (uid: string) => {
  return jwt.sign(
    {
      uid,
    },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "60d",
    }
  );
};

export const getUidFromToken = (token: string) => {
  try {
    return (jwt.decode(token) as CustomJWTClaims).uid;
  } catch (e) {
    throw new Error("Invalid token");
  }
};

export const parseHeaders = (headers: string) => {
  let json: Record<string, string> = {};
  const sanitized = headers.trimEnd().replace(/[']+/g, "").split("\n");

  console.log("Sanitized headers:", sanitized);

  sanitized.map((e) => {
    let elements = e.split(": ");
    if (elements.length > 2) return;
    json[elements[0].trim().toLocaleLowerCase()] = elements[1];
  });

  return json as Headers;
};

export const updateLastLogin = async (id: string) => {
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      lastLogin: new Date(),
    },
  });
};
