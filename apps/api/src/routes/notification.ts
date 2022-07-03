import { Router } from "express";
import { prisma } from "../../prisma/client";
import type { Request as ExpressJwtRequest } from "express-jwt";
import type { AuthRequestWithPayload } from "../types";
import type { Notification } from "@prisma/client";
import { NOTIFICATION_ESSENTIALS_FIELDS } from "../constants";

const router = Router();

router.get("/list", async (req: ExpressJwtRequest, res) => {
  const notifications = await prisma.notification.findMany({
    where: {
      id: req.auth?.uid,
    },
  });

  return res.json(notifications);
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
    select: NOTIFICATION_ESSENTIALS_FIELDS,
  });

  return res.json(notification);
});

export default router;
