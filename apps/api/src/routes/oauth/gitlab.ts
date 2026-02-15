import { Hono } from "hono";
import axios from "axios";
import type { User } from "../../db/schema";
import { users } from "../../db/schema";
import { getAccessToken, getRefreshToken } from "../../utils/common";
import { getValidHookId } from "../../utils/get-valid-hook-id";
import * as Sentry from "@sentry/cloudflare";
import { APP_URL_SCHEME } from "../../utils/constants";
import { eq } from "drizzle-orm";
import { AppEnv } from "../../utils/types";

const gitlab = new Hono<AppEnv>();

type GitLabTokenResponse = {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  created_at: number;
  scope: string;
};

type GitlabUserResponse = {
  id: number;
  email: string;
};

// Workaround for redirecting with a script
// Mobile browsers don't always redirect properly
const redirectWithScript = (url: string) => {
  return `
  <script>
    window.location.href = "${url}";
  </script>
`;
};

const redirectWithError = (error: string) =>
  redirectWithScript(
    `${APP_URL_SCHEME}login?error=${encodeURIComponent(error)}`,
  );

gitlab.get("/authorize", async (c) => {
  const state = c.req.query("state");

  const params = new URLSearchParams({
    client_id: c.env.GITLAB_APP_ID,
    redirect_uri: c.env.GITLAB_REDIRECT_URI,
    response_type: "code",
    scope: "read_user",
    ...(state && { state }),
  });

  return c.redirect(`https://gitlab.com/oauth/authorize?${params}`);
});

gitlab.get("/callback", async (c) => {
  const error = c.req.query("error");
  const errorDescription = c.req.query("error_description");

  if (error && errorDescription) {
    console.error("Error on GitLab OAuth callback: ", error, errorDescription);
    return c.html(redirectWithError(errorDescription));
  }

  const code = c.req.query("code");
  const state = c.req.query("state");

  try {
    let profile: GitlabUserResponse;
    try {
      const { data: tokens } = await axios.post<GitLabTokenResponse>(
        "https://gitlab.com/oauth/token",
        null,
        {
          params: {
            client_id: c.env.GITLAB_APP_ID,
            client_secret: c.env.GITLAB_APP_SECRET,
            grant_type: "authorization_code",
            code,
            redirect_uri: c.env.GITLAB_REDIRECT_URI,
          },
        },
      );

      const { data } = await axios.get<GitlabUserResponse>(
        "https://gitlab.com/api/v4/user",
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        },
      );

      profile = data;
    } catch (error) {
      Sentry.captureException(error);
      console.error("Error while authenticating with GitLab", error);
      return c.html(redirectWithError("Couldn't authenticate with GitLab"));
    }

    const alreadyExistingUser = await c.var.db
      .select()
      .from(users)
      .where(eq(users.gitlabId, profile.id))
      .get();

    // Login existing user
    if (alreadyExistingUser) {
      const accessToken = getAccessToken(
        {
          uid: alreadyExistingUser.id,
          hookId: alreadyExistingUser.hookId,
        },
        c.env.JWT_ACCESS_SECRET,
      );
      const refreshToken = getRefreshToken(
        alreadyExistingUser.id,
        c.env.JWT_REFRESH_SECRET,
      );

      return c.html(
        redirectWithScript(
          `${APP_URL_SCHEME}login?accessToken=${accessToken}&refreshToken=${refreshToken}`,
        ),
      );
    }

    // Signup new user or link to existing account
    let user: User;
    if (state) {
      // User is connecting GitLab to existing email/password account
      const existingUser = await c.var.db
        .select()
        .from(users)
        .where(eq(users.id, state))
        .get();

      if (!existingUser) {
        console.error(
          "Error while retrieving user from state, existing user not found",
        );
        return c.html(
          redirectWithError(
            "We couldn't associate your GitLab account with your email password account. Please try again.",
          ),
        );
      }

      user = await c.var.db
        .update(users)
        .set({
          gitlabId: profile.id,
          email: existingUser.email || profile.email,
        })
        .where(eq(users.id, existingUser.id))
        .returning()
        .get();
    } else {
      // new user
      const hookId = await getValidHookId(c.var.db);

      const newUser = await c.var.db
        .insert(users)
        .values({
          hookId,
          gitlabId: profile.id,
          email: profile.email,
        })
        .returning()
        .get();

      user = newUser;
    }

    const accessToken = getAccessToken(
      { uid: user.id, hookId: user.hookId },
      c.env.JWT_ACCESS_SECRET,
    );
    const refreshToken = getRefreshToken(user.id, c.env.JWT_REFRESH_SECRET);

    return c.html(
      redirectWithScript(
        `${APP_URL_SCHEME}login?accessToken=${accessToken}&refreshToken=${refreshToken}`,
      ),
    );
  } catch (error) {
    console.error("Unexpected error in GitLab OAuth:", error);
    Sentry.captureException(error);
    return c.html(redirectWithError("An unexpected error occurred"));
  }
});

export default gitlab;
