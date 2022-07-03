import type { NextFunction, Request, Response } from "express";
import { expressjwt } from "express-jwt";

type AuthRequiredOptions = {
  failIfNoTokenFound: boolean;
};

/**
 * Require a JWT token to be present in the request.
 * @param failIfNoTokenFound If true (default) throw an error if no token is found.
 */
export const authRequired = (
  options: AuthRequiredOptions | undefined = undefined
) =>
  expressjwt({
    secret: process.env.JWT_ACCESS_SECRET!,
    algorithms: ["HS256"],
    credentialsRequired: options?.failIfNoTokenFound,
  });

/**
 * Handle a failed JWT authentication.
 * @param err Error thrown by express-jwt
 */
export const handleUnauthorizedError = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === "UnauthorizedError") {
    return res.status(403).json({
      message: "Unauthorized",
    });
  } else {
    next(err);
  }
};
