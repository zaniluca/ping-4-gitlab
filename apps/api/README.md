# Ping for Gitlab API

> Backend for the Ping for Gitlab app made in nodejs, typescript, express, prisma and Postgresql

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/VBTK_N?referralCode=ntz0Ea)

## How to run

Create a `.env` file in the root of the project and add the following lines:

```
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/ping4gitlab?schema=public
JWT_ACCESS_SECRET=<your-secret-here>
JWT_REFRESH_SECRET=<your-secret-here>
WEBHOOK_SECRET=<your-secret-here>
GITLAB_APP_ID=<your-appid-here>
GITLAB_APP_SECRET=<your-secret-here>
ANDROID_EMULATOR=false
```

> Note: The `ANDROID_EMULATOR` variable is used to determine if the app is running on an android emulator or not. This is used to determine the correct redirect url for the gitlab oauth flow.

Now simply run `pnpm install` and `pnpm dev` to start the server
