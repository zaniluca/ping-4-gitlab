import type { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { BadRequestError, ErrorWithStatus } from "./utils/errors";
import yup, { ValidationError } from "yup";
import * as Sentry from "@sentry/node";
import type { Request as ExpressJwtRequest } from "express-jwt";

export const handleError = (
  err: Error | ErrorWithStatus,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err.name === "ErrorWithStatus") {
    return res.status((err as ErrorWithStatus).status).json({
      message: err.message,
    });
  } else if (err.name === "UnauthorizedError") {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }

  return res.status(500).json({
    message: "Oops! Something went wrong",
  });
};

export const logError = (
  err: Error,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === "test") return next(err);

  if (err.name === "UnauthorizedError") return next(err);

  console.error(`${err.name}: ${err.message}`);
  next(err);
};

export const requestLogger = morgan(
  process.env.NODE_ENV === "production" ? "short" : "dev",
  { skip: () => process.env.NODE_ENV === "test" }
);

export const validate =
  ({ bodySchema }: Partial<{ bodySchema: yup.AnyObjectSchema }>) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await bodySchema?.validate(req.body);
    } catch (error) {
      if (error instanceof ValidationError) {
        next(new BadRequestError(error.errors[0]));
      }
    }
    next();
  };

export const attachSentryUserInfo = (
  req: ExpressJwtRequest,
  _res: Response,
  next: NextFunction
) => {
  if (!req.auth?.uid) return next();

  Sentry.setUser({
    id: req.auth?.uid,
    username: req.auth?.hookId,
  });
  next();
};
