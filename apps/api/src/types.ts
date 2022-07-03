import type { Request } from "express";
import type { Request as ExpressJwtRequest } from "express-jwt";
import type { JwtPayload } from "jsonwebtoken";

export type CustomJWTClaims = JwtPayload & {
  uid: string;
};

export interface RequestWithPayload<T> extends Request {
  body: Partial<T>;
}

export interface AuthRequestWithPayload<T>
  extends ExpressJwtRequest<CustomJWTClaims> {
  body: Partial<T>;
}
