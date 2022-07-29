import type { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import type { ErrorWithStatus } from "./utils/errors";

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
  if (process.env.NODE_ENV !== "test") {
    console.error(`${err.name}: ${err.message}`);
  }
  next(err);
};

export const requestLogger = morgan(
  process.env.NODE_ENV === "production" ? "short" : "dev",
  { skip: () => process.env.NODE_ENV === "test" }
);
