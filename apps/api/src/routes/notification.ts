import { Router } from "express";
import prisma from "../../prisma/client";
import type { Request as ExpressJwtRequest } from "express-jwt";
import type { Notification } from "@prisma/client";
import type { AuthRequestWithPayload } from "../utils/types";

const router = Router();

router.get("/list", async (req: ExpressJwtRequest, res) => {
  const { cursor } = req.query;

  let paginationParams = {};
  if (cursor) {
    paginationParams = {
      take: 50,
      skip: 1,
      cursor: {
        id: cursor,
      },
    };
  }

  const notifications = await prisma.notification.findMany({
    where: {
      userId: req.auth?.uid,
    },
    orderBy: {
      recived: "desc",
    },
    take: 50,
    ...paginationParams,
  });

  const totalCount = await prisma.notification.count({
    where: {
      userId: req.auth?.uid,
    },
  });

  res.setHeader("X-Total-Count", totalCount);

  return res.json(notifications);
});

router.get("/:id", async (req: ExpressJwtRequest, res) => {
  const notification = await prisma.notification.findUnique({
    where: {
      id: req.params.id,
    },
  });

  return res.json(notification);
});

router.put("/:id", async (req: AuthRequestWithPayload<Notification>, res) => {
  const { headers, ...rest } = req.body;

  const notification = await prisma.notification.update({
    where: {
      id: req.params.id,
    },
    data: {
      ...rest,
    },
  });

  return res.json(notification);
});

export default router;
