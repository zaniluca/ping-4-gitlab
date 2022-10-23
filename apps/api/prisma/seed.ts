import prisma from "./client";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

const USERS = [
  {
    id: "test-1",
    email: "test@test.com",
    password: bcrypt.hashSync("Test1234!", 10),
    expoPushTokens: [],
    hookId: "test",
    onboardingCompleted: true,
  },
  {
    id: "test-2",
    email: "lucazani2002@gmail.com",
    password: bcrypt.hashSync("Test1234!", 10),
    expoPushTokens: [],
    hookId: "luca",
    onboardingCompleted: true,
  },
  {
    id: "test-3",
    email: "onboarding@test.com",
    password: bcrypt.hashSync("Test1234!", 10),
    expoPushTokens: [],
    hookId: "onboarding",
  },
  {
    id: "test-4",
    expoPushTokens: [],
    hookId: "anonymous-1",
  },
  {
    id: "test-5",
    expoPushTokens: [],
    hookId: "anonymous-2",
    onboardingCompleted: true,
  },
];

const ISSUE_1 = {
  contentHash: "3054c33171dda1f57dbbb723bfa236afa2114a58",
  headers: {
    "auto-submitted": "auto-generated",
    "content-transfer-encoding": "7bit",
    "content-type":
      'multipart/alternative; boundary="--==_mimepart_626e736ab15b1_25c2544441707a3"; charset=UTF-8',
    date: "Sun, 01 May 2022 11:47:54 +0000",
    from: "GitLab <gitlab@mg.gitlab.com>",
    "message-id":
      "<626e736ab62ee_25c25444417085e@gitlab-sidekiq-catchall-v2-f8d77445-qwhm7.mail>",
    "mime-version": "1.0",
    received:
      "from mg.gitlab.com (15.226.74.34.bc.googleusercontent.com [34.74.226.15]) by smtp-out-n04.prod.us-west-2.postgun.com with SMTP id 626e736b61f00567d55c5cb7 (version=TLS1.3, cipher=TLS_AES_128_GCM_SHA256); Sun, 01 May 2022 11:47:55 GMT",
    "reply-to": "noreply@gitlab.com",
    sender: "gitlab@mg.gitlab.com",
    subject: "Feat: Skeleton loader component",
    to: "test@pfg.app",
    "x-auto-response-suppress": "All",
    "x-gitlab-issue-id": "106950598",
    "x-gitlab-issue-iid": "853",
    "x-gitlab-notificationreason:": undefined,
    "x-gitlab-project": "ping-4-gitlab",
    "x-gitlab-project-id": "18854524",
    "x-gitlab-project-path": "zaniluca/ping-4-gitlab",
    "x-mailgun-sending-ip": "23.253.183.236",
    "x-mailgun-sid": "WyI4ZTU5ZSIsICJ0ZXN0QGNsb3VkbW92ZXIuYXBwIiwgIjk0N2I0Il0=",
  },
  html: `<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\" \"http://www.w3.org/TR/REC-html40/loose.dtd\"><html lang=\"en\"><head><meta content=\"text/html; charset=US-ASCII\" http-equiv=\"Content-Type\"><title>GitLab</title><style>img {max-width: 100%; height: auto;}body {font-size: 0.875rem;}body {-webkit-text-shadow: rgba(255,255,255,0.01) 0 0 1px;}body {font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Noto Sans\", Ubuntu, Cantarell, \"Helvetica Neue\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; font-size: inherit;}</style></head><body style='font-size: inherit; -webkit-text-shadow: rgba(255,255,255,0.01) 0 0 1px; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Noto Sans\", Ubuntu, Cantarell, \"Helvetica Neue\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";'><div class=\"content\"><p>Assignee changed to<strong style=\"font-weight: bold;\"> Luca Zani</strong></p></div></body></html>`,
  subject: "Feat: Skeleton loader component",
  text: "Reassigned issue 853 https://gitlab.com/zaniluca/test Assignee changed to Luca Zani ",
};

const PROJECTS = ["ping-4-gitlab", "test-project", "test"];
const NOTIFICATIONS = [ISSUE_1];

const load = async () => {
  try {
    await prisma.user.deleteMany();
    await prisma.notification.deleteMany();

    await prisma.user.createMany({
      data: USERS,
    });

    USERS.forEach(async (user) => {
      const notifications = Array.from({ length: 100 }).map((_, i) => {
        const randomProject =
          PROJECTS[Math.floor(Math.random() * PROJECTS.length)];
        const randomNotification =
          NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)];

        return {
          ...randomNotification,
          contentHash: `seeded-${randomUUID()}`,
          userId: user.id,
          headers: {
            ...randomNotification.headers,
            to: `${user.hookId}@pfg.app"`,
            "x-gitlab-project": randomProject,
            "x-gitlab-project-path": `${user.hookId}/${randomProject}`,
          },
        };
      });

      await prisma.notification.createMany({
        data: notifications,
      });
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
