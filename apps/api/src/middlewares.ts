import type { NextFunction, Request, Response } from "express";
import { ErrorWithStatus } from "./utils/errors";

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

export const handleErrorWithStatus = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json({
      message: err.message,
    });
  } else {
    next(err);
  }
};
