import { Router, Request } from "express";
import { prisma } from "../../prisma/client";
import bcrypt from "bcrypt";
import type {
  AuthRequestWithPayload,
  RequestWithPayload,
} from "../utils/types";
import {
  getAccessToken,
  getRefreshToken,
  getUidFromToken,
  updateLastLogin,
  validateRefreshToken,
} from "../utils/common";
import { authRequired } from "../middlewares";
import type { User } from "@prisma/client";
import { SignupSchema } from "../utils/validation";
import { BadRequestError, CredentialsError } from "../utils/errors";
import { UnauthorizedError } from "express-jwt";
import yup, { ValidationError } from "yup";

const router = Router();

type LoginPayload = {
  email: string;
  password: string;
};

router.post("/login", async (req: RequestWithPayload<LoginPayload>, res) => {
  const { email, password } = req.body;

  if (!password || !email) {
    throw new CredentialsError("Missing required fields");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || !bcrypt.compareSync(password, user.password!)) {
    throw new CredentialsError("Invalid credentials");
  }

  await updateLastLogin(user.id);

  return res.status(200).json({
    accessToken: getAccessToken(user.id),
    refreshToken: getRefreshToken(user.id),
  });
});

type SignupPayload = yup.InferType<typeof SignupSchema>;

router.post(
  "/signup",
  authRequired({ failIfNoTokenFound: false }),
  async (req: AuthRequestWithPayload<SignupPayload>, res) => {
    try {
      SignupSchema.validateSync(req.body);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          message: error.errors[0],
        });
      }
    }

    const { password, email } = req.body;
    const isAnonymous = !!req.auth?.uid;

    const alreadyExists = await prisma.user.count({
      where: {
        email,
      },
    });

    if (alreadyExists) {
      throw new CredentialsError("User already exists");
    }

    let user: Pick<User, "id">;

    if (isAnonymous) {
      // Upgrading anonymous user to permanent user
      user = await prisma.user.update({
        where: {
          id: req.auth?.uid,
        },
        data: {
          email,
          password: password ? bcrypt.hashSync(password, 10) : undefined,
        },
        select: {
          id: true,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email,
          password: password ? bcrypt.hashSync(password, 10) : undefined,
        },
        select: {
          id: true,
        },
      });
    }

    return res.status(201).json({
      accessToken: getAccessToken(user.id),
      refreshToken: getRefreshToken(user.id),
    });
  }
);

router.post("/anonymous", async (_req: Request, res) => {
  const user = await prisma.user.create({
    data: {},
    select: {
      id: true,
    },
  });

  return res.status(201).json({
    accessToken: getAccessToken(user.id),
    refreshToken: getRefreshToken(user.id),
  });
});

type RefreshPayload = {
  refreshToken: string;
};

router.post(
  "/refresh",
  async (req: RequestWithPayload<RefreshPayload>, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new BadRequestError("Missing required fields");
    }

    if (!validateRefreshToken(refreshToken)) {
      throw new UnauthorizedError("invalid_token", {
        message: "Invalid refresh token",
      });
    }

    const uid = getUidFromToken(refreshToken);

    await updateLastLogin(uid);

    return res.status(200).json({
      accessToken: getAccessToken(uid),
    });
  }
);

export default router;
