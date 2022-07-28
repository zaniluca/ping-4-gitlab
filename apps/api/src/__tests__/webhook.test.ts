import type { User } from "@prisma/client";
import request from "supertest";
import app from "..";
import prismaMock from "../../prisma/mocked-client";
import bcrypt from "bcrypt";

describe("POST /webhook", () => {
  it("Rejects requests without valid secret", async () => {
    await request(app)
      .post("/webhook")
      .query({ token: "invalid" })
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Unauthorized");
      });
  });
  it("Fails if the user doesn't exist", async () => {
    prismaMock.user.findUniqueOrThrow.mockRejectedValue(new Error());

    await request(app)
      .post("/webhook")
      .query({ token: process.env.WEBHOOK_SECRET })
      .field("to", MOCK_NOTIFICATION_PAYLOAD.to)
      .field("subject", MOCK_NOTIFICATION_PAYLOAD.subject)
      .field("text", MOCK_NOTIFICATION_PAYLOAD.text)
      .field("html", MOCK_NOTIFICATION_PAYLOAD.html)
      .field("headers", MOCK_NOTIFICATION_PAYLOAD.headers)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("User with hook test doesn't exist");
      });
  });
  it("Creates the notification", async () => {
    prismaMock.user.findUniqueOrThrow.mockResolvedValue(MOCK_USER);

    await request(app)
      .post("/webhook")
      .query({ token: process.env.WEBHOOK_SECRET })
      .field("to", MOCK_NOTIFICATION_PAYLOAD.to)
      .field("subject", MOCK_NOTIFICATION_PAYLOAD.subject)
      .field("text", MOCK_NOTIFICATION_PAYLOAD.text)
      .field("html", MOCK_NOTIFICATION_PAYLOAD.html)
      .field("headers", MOCK_NOTIFICATION_PAYLOAD.headers);

    expect(prismaMock.notification.create).toHaveBeenCalledWith({
      data: EXPECTED_NOTIFICATION_DATA,
    });
  });
});

const MOCK_NOTIFICATION_PAYLOAD = {
  to: "test@pfg.app",
  subject: "Feat: Skeleton loader component",
  from: "GitLab <gitlab@mg.gitlab.com>",
  html: `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd"><html lang="en"><head><meta content="text/html; charset=US-ASCII" http-equiv="Content-Type"><title>GitLab</title><style>img {max-width: 100%; height: auto;}body {font-size: 0.875rem;}body {-webkit-text-shadow: rgba(255,255,255,0.01) 0 0 1px;}body {font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Ubuntu, Cantarell, "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; font-size: inherit;}</style></head><body style='font-size: inherit; -webkit-text-shadow: rgba(255,255,255,0.01) 0 0 1px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Ubuntu, Cantarell, "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";'><div class="content"><p>Assignee changed to<strong style="font-weight: bold;"> Luca Zani</strong></p></div><div class="footer" style="margin-top: 10px;"><p style="font-size: small; color: #666;">&#8212;<br>Reply to this email directly or <a href="#" style="color: #1068bf; text-decoration: none;">view it on GitLab</a>.<br>You're receiving this email because of your activity on gitlab.com.If you'd like to receive fewer emails, you can<a href="#" style="color: #1068bf; text-decoration: none;"> unsubscribe </a>from this thread oradjust your notification settings.<script type="application/ld+json">{"@context":"http://schema.org","@type":"EmailMessage","action":{"@type":"ViewAction","name":"View Merge request","url":"#"}}</script></p></div></body></html>`,
  text: "Reassigned issue 853 https://gitlab.com/zaniluca/test Assignee changed  to Luca Zani -- Reply to this email directly or view it on GitLab: https://gitlab.com/zaniluca/test You're receiving this email because of your activity on gitlab.com.",
  headers: `Received: by mx0131p1mdw1.sendgrid.net with SMTP id T5LHSeOkHk Sun, 01 May 2022 11:47:57 +0000 (UTC)
Received: from mail-183-236.mailgun.info (unknown [23.253.183.236]) by mx0131p1mdw1.sendgrid.net(Postfix) with ESMTPS id 1E5ED40DA0 for <test@cloudmover.app>; Sun, 1 May 2022 11:47:57 +0000 (UTC) 
DKIM-Signature: a=rsa-sha256; v=1; c=relaxed/relaxed; d=mg.gitlab.com; q=dns/txt; s=mailo; t=1651405677; h=Content-Transfer-Encoding: Content-Type: Mime-Version: Subject: Subject: Message-ID: To: To: Reply-To: From: From: Date: Sender: Sender; bh=zesZG6oZpukLxDjxbIdNjkAfFthUeBwRqa24lG9EjQk=; b=oJcWYC4hEA+ErSIETlsFQCn94T0MsG+7IVAJWvAjmhtqMJpO229fGwojMav72RNah+LkEqK0 7r9rQtyOg3PCF/K1NwqdcVmDpkStJr/qOh6ZJ0qbS7cG6XTVDC/eUI75vCyFxR51v7rhct3D gXuSqsXD0QimVdxrb+dGBlU+A3A=
X-Mailgun-Sending-Ip: 23.253.183.236
X-Mailgun-Sid: WyI4ZTU5ZSIsICJ0ZXN0QGNsb3VkbW92ZXIuYXBwIiwgIjk0N2I0Il0=
Received: from mg.gitlab.com (15.226.74.34.bc.googleusercontent.com [34.74.226.15]) by smtp-out-n04.prod.us-west-2.postgun.com with SMTP id 626e736b61f00567d55c5cb7 (version=TLS1.3, cipher=TLS_AES_128_GCM_SHA256); Sun, 01 May 2022 11:47:55 GMT
Sender: gitlab@mg.gitlab.com
Date: Sun, 01 May 2022 11:47:54 +0000
From: GitLab <gitlab@mg.gitlab.com>
Reply-To: noreply@gitlab.com
To: test@pfg.app
Message-ID: <626e736ab62ee_25c25444417085e@gitlab-sidekiq-catchall-v2-f8d77445-qwhm7.mail>
Subject: Confirmation instructions
Mime-Version: 1.0
Content-Type: multipart/alternative; boundary="--==_mimepart_626e736ab15b1_25c2544441707a3"; charset=UTF-8
Content-Transfer-Encoding: 7bit
Auto-Submitted: auto-generated
X-Auto-Response-Suppress: All
X-GitLab-Project: general
X-GitLab-Project-Id: 18854524
X-GitLab-Project-Path: zaniluca/test
X-GitLab-Issue-ID: 106950598
X-GitLab-Issue-IID: 884
X-GitLab-NotificationReason: 
  `,
};

const EXPECTED_NOTIFICATION_DATA = {
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
    subject: "Confirmation instructions",
    to: "test@pfg.app",
    "x-auto-response-suppress": "All",
    "x-gitlab-issue-id": "106950598",
    "x-gitlab-issue-iid": "884",
    "x-gitlab-notificationreason:": undefined,
    "x-gitlab-project": "general",
    "x-gitlab-project-id": "18854524",
    "x-gitlab-project-path": "zaniluca/test",
    "x-mailgun-sending-ip": "23.253.183.236",
    "x-mailgun-sid": "WyI4ZTU5ZSIsICJ0ZXN0QGNsb3VkbW92ZXIuYXBwIiwgIjk0N2I0Il0=",
  },
  html: `<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\" \"http://www.w3.org/TR/REC-html40/loose.dtd\"><html lang=\"en\"><head><meta content=\"text/html; charset=US-ASCII\" http-equiv=\"Content-Type\"><title>GitLab</title><style>img {max-width: 100%; height: auto;}body {font-size: 0.875rem;}body {-webkit-text-shadow: rgba(255,255,255,0.01) 0 0 1px;}body {font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Noto Sans\", Ubuntu, Cantarell, \"Helvetica Neue\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; font-size: inherit;}</style></head><body style='font-size: inherit; -webkit-text-shadow: rgba(255,255,255,0.01) 0 0 1px; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Noto Sans\", Ubuntu, Cantarell, \"Helvetica Neue\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";'><div class=\"content\"><p>Assignee changed to<strong style=\"font-weight: bold;\"> Luca Zani</strong></p></div></body></html>`,
  subject: "Feat: Skeleton loader component",
  text: "Reassigned issue 853 https://gitlab.com/zaniluca/test Assignee changed  to Luca Zani ",
  userId: "1",
};

const MOCK_USER: User = {
  id: "1",
  email: "test@test.com",
  password: bcrypt.hashSync("Test1234!", 10),
  createdAt: new Date(),
  updatedAt: new Date(),
  expoPushTokens: [],
  hookId: "test",
  lastLogin: new Date(Date.now() - 1000),
  onboardingCompleted: false,
};
