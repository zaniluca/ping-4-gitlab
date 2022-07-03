import { Router, Request } from "express";
import type { WebhookPayload } from "../types";
import hash from "object-hash";
import { prisma } from "../../prisma/client";
import type { User } from "@prisma/client";
import multer from "multer";
import { parseHeaders } from "../utils";

const router = Router();

const sanitizeText = (text: string) => {
  // Removing "Reply to this email..."
  //https://stackoverflow.com/a/56391193/12661017
  // return text.trimStart().replace(/-- .*/g, "$'");
  return text.trimStart().split("--")[0];
};

router.post("/webhook", multer().none(), async (req: Request, res) => {
  // Parsing the body content that is sent by sendgrid as a multipart form
  const body = req.body as WebhookPayload;
  console.log("Body parsed", body);

  if (!body) {
    console.error("Failed to parse body", body);
    res.status(500);
    return;
  }

  const { to, subject, text: rawText, html, headers: rawHeaders } = body!;

  const data = {
    subject,
    rawText,
    html,
  };

  const hookId = to.split("@")[0];
  const contentHash = hash(data);

  // Parsing headers string into object
  const headers = parseHeaders(rawHeaders);
  console.log("Parsed Headers: ", headers);

  // Removing unwanted parts from text
  // But also keeping original
  const text = sanitizeText(rawText);
  console.log("Sanitized text: ", text);

  let user: User;
  try {
    user = await prisma.user.findUniqueOrThrow({
      where: {
        hookId,
      },
    });
  } catch (error) {
    console.warn(`User with hook ${hookId} doesn't exist`);
    res.status(404).end();
    return;
  }

  try {
    const notification = await prisma.notification.create({
      data: {
        ...data,
        headers,
        text,
        rawHeaders,
        contentHash,
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).end();
    return;
  }
});

export default router;
