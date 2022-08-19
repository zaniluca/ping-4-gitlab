import { Router } from "express";
import bcrypt from "bcrypt";
import type { User } from "@prisma/client";
import type { Request as ExpressJwtRequest } from "express-jwt";
import { USER_PUBLIC_FIELDS } from "../utils/constants";
import type { AuthRequestWithPayload } from "../utils/types";
import prisma from "../../prisma/client";
import { ErrorWithStatus } from "../utils/errors";
import { validate } from "../middlewares";
import { UserUpdateBodySchema } from "../utils/validation";

const router = Router();

router.get("/", async (req: ExpressJwtRequest, res, next) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: req.auth?.uid,
      },
      select: USER_PUBLIC_FIELDS,
    });

    return res.json(user);
  } catch (e) {
    console.error(e);
    return next(new ErrorWithStatus(500, "Could not find user"));
  }
});

router.put(
  "/",
  validate({ bodySchema: UserUpdateBodySchema }),
  async (req: AuthRequestWithPayload<User>, res, next) => {
    const { password, email, hookId, expoPushTokens, mutedUntil } = req.body;

    try {
      const user = await prisma.user.update({
        where: {
          id: req.auth?.uid,
        },
        data: {
          email,
          hookId,
          expoPushTokens,
          mutedUntil,
          password: password ? bcrypt.hashSync(password, 10) : undefined,
        },
        select: USER_PUBLIC_FIELDS,
      });
      return res.status(200).json(user);
    } catch (e) {
      console.error(e);
      return next(new ErrorWithStatus(500, "Could not update user"));
    }
  }
);

router.delete("/", async (req: ExpressJwtRequest, res, next) => {
  try {
    await prisma.user.delete({
      where: {
        id: req.auth?.uid,
      },
    });
  } catch (e) {
    console.error(e);
    return next(new ErrorWithStatus(500, "Could not delete user"));
  }

  return res.status(200).json({
    message: "User deleted",
  });
});

export default router;
