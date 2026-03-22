import bcrypt from "bcryptjs";
import { testApp } from "..";
import drizzleMock from "../__mocks__/drizzle-mock";
import { mockExecutionCtx } from "../__mocks__/cloudflare-workers-mock";
import { User } from "../db/schema";

describe("POST /webhook", () => {
  const mockEnv = {
    WEBHOOK_SECRET: "test-secret",
    JWT_ACCESS_SECRET: "test-jwt-secret",
    JWT_REFRESH_SECRET: "test-jwt-refresh-secret",
    DB: {} as any,
    ENVIRONMENT: "test",
    GITLAB_REDIRECT_URI: "http://localhost:8080/oauth/gitlab/callback",
    DATABASE_URL: "test-db-url",
    GITLAB_APP_ID: "test-app-id",
    GITLAB_APP_SECRET: "test-app-secret",
  } as Env;

  it("Rejects requests without valid secret", async () => {
    const res = await testApp.request(
      "/webhook?token=invalid",
      { method: "POST" },
      mockEnv,
      mockExecutionCtx,
    );
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ message: "Unauthorized" });
  });
  it("Fails if the user doesn't exist", async () => {
    const mockWhere = vi.fn().mockReturnValue({
      get: vi.fn().mockResolvedValue(undefined),
    });
    const mockFrom = vi.fn().mockReturnValue({
      where: mockWhere,
    });
    drizzleMock.select.mockReturnValue({
      from: mockFrom,
    } as any);

    const formData = new FormData();
    formData.append("to", MOCK_NOTIFICATION_PAYLOAD.to);
    formData.append("subject", MOCK_NOTIFICATION_PAYLOAD.subject);
    formData.append("text", MOCK_NOTIFICATION_PAYLOAD.text);
    formData.append("html", MOCK_NOTIFICATION_PAYLOAD.html);
    formData.append("headers", MOCK_NOTIFICATION_PAYLOAD.headers);

    const res = await testApp.request(
      `/webhook?token=${mockEnv.WEBHOOK_SECRET}`,
      {
        method: "POST",
        body: formData,
      },
      mockEnv,
      mockExecutionCtx,
    );

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      message: "User with hook test doesn't exist",
    });
  });
  it("Creates the notification", async () => {
    // Mock user lookup
    const mockUserWhere = vi.fn().mockReturnValue({
      get: vi.fn().mockResolvedValue(MOCK_USER),
    });
    const mockUserFrom = vi.fn().mockReturnValue({
      where: mockUserWhere,
    });

    // Mock existing notification check (should return undefined - no duplicate)
    const mockExistingNotifWhere = vi.fn().mockReturnValue({
      get: vi.fn().mockResolvedValue(undefined),
    });
    const mockExistingNotifFrom = vi.fn().mockReturnValue({
      where: mockExistingNotifWhere,
    });

    // Mock notification insert
    const mockNotificationReturning = vi.fn().mockReturnValue({
      get: vi.fn().mockResolvedValue({
        id: "notif-1",
        subject: "Skeleton loader component",
        text: "Reassigned issue 853 https://gitlab.com/zaniluca/test Assignee changed  to Luca Zani ",
        html: expect.any(String),
        userId: MOCK_USER.id,
        contentHash: expect.any(String),
        headers: expect.any(Object),
        createdAt: new Date(),
      }),
    });
    const mockNotificationValues = vi.fn().mockReturnValue({
      returning: mockNotificationReturning,
    });

    // Mock notification count
    const mockCountWhere = vi
      .fn()
      .mockReturnValue(Promise.resolve([{ value: 1 }]));
    const mockCountFrom = vi.fn().mockReturnValue({
      where: mockCountWhere,
    });

    // Mock user update for onboarding completion
    const mockUpdateReturning = vi.fn().mockReturnValue({
      get: vi
        .fn()
        .mockResolvedValue({ ...MOCK_USER, onboardingCompleted: true }),
    });
    const mockUpdateWhere = vi.fn().mockReturnValue({
      returning: mockUpdateReturning,
    });
    const mockUpdateSet = vi.fn().mockReturnValue({
      where: mockUpdateWhere,
    });

    drizzleMock.select
      .mockReturnValueOnce({ from: mockUserFrom } as any)
      .mockReturnValueOnce({ from: mockExistingNotifFrom } as any)
      .mockReturnValueOnce({ from: mockCountFrom } as any);

    drizzleMock.insert.mockReturnValue({
      values: mockNotificationValues,
    } as any);

    drizzleMock.update.mockReturnValue({
      set: mockUpdateSet,
    } as any);

    const formData = new FormData();
    formData.append("to", MOCK_NOTIFICATION_PAYLOAD.to);
    formData.append("subject", MOCK_NOTIFICATION_PAYLOAD.subject);
    formData.append("text", MOCK_NOTIFICATION_PAYLOAD.text);
    formData.append("html", MOCK_NOTIFICATION_PAYLOAD.html);
    formData.append("headers", MOCK_NOTIFICATION_PAYLOAD.headers);

    const res = await testApp.request(
      `/webhook?token=${mockEnv.WEBHOOK_SECRET}`,
      {
        method: "POST",
        body: formData,
      },
      mockEnv,
      mockExecutionCtx,
    );

    // Since user has no push tokens, it will return 400
    expect(res.status).toBe(400);
    expect(mockNotificationValues).toHaveBeenCalled();
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
  contentHash: "10c6960f21feed9e0cf632c071d6b559e4c203ce",
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
  mutedUntil: null,
  gitlabId: null,
};
