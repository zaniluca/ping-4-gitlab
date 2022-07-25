import { Router, Request } from "express";
import prisma from "../../prisma/client";
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
import type { User } from "@prisma/client";
import { SignupSchema } from "../utils/validation";
import { BadRequestError, CredentialsError } from "../utils/errors";
import { expressjwt, UnauthorizedError } from "express-jwt";
import yup, { ValidationError } from "yup";

const router = Router();

type LoginPayload = {
  email: string;
  password: string;
};

router.post(
  "/login",
  async (req: RequestWithPayload<LoginPayload>, res, next) => {
    const { email, password } = req.body;

    if (!password || !email) {
      return next(new BadRequestError("Missing required fields"));
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !bcrypt.compareSync(password, user.password!)) {
      return next(new CredentialsError("Invalid credentials"));
    }

    await updateLastLogin(user.id);

    return res.status(200).json({
      accessToken: getAccessToken(user.id),
      refreshToken: getRefreshToken(user.id),
    });
  }
);

type SignupPayload = yup.InferType<typeof SignupSchema>;

router.post(
  "/signup",
  expressjwt({
    secret: process.env.JWT_ACCESS_SECRET!,
    algorithms: ["HS256"],
    credentialsRequired: false,
  }),
  async (req: AuthRequestWithPayload<SignupPayload>, res, next) => {
    try {
      SignupSchema.validateSync(req.body);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          message: error.errors[0],
        });
      }
    }

    const { password, email } = req.body as SignupPayload;
    const isAnonymous = !!req.auth?.uid;

    const alreadyExists = await prisma.user.count({
      where: {
        email,
      },
    });

    if (alreadyExists) {
      return next(new CredentialsError("User already exists"));
    }

    let user: Pick<User, "id">;

    if (isAnonymous) {
      console.log("Upgrading anonymous user to permanent user");

      user = await prisma.user.update({
        where: {
          id: req.auth?.uid,
        },
        data: {
          email,
          password: bcrypt.hashSync(password, 10),
        },
        select: {
          id: true,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email,
          password: bcrypt.hashSync(password, 10),
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
  async (req: RequestWithPayload<RefreshPayload>, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new BadRequestError("Missing required fields"));
    }

    if (!validateRefreshToken(refreshToken)) {
      return next(
        new UnauthorizedError("invalid_token", {
          message: "Invalid refresh token",
        })
      );
    }

    const uid = getUidFromToken(refreshToken);

    await updateLastLogin(uid);

    return res.status(200).json({
      accessToken: getAccessToken(uid),
    });
  }
);

export default router;
