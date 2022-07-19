# api-ping-4-gitlab

> Backend for the Ping for Gitlab app made in nodejs, typescript, express, prisma and Postgresql

## How to run

Create a `.env` file in the root of the project and add the following lines:

```
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/ping4gitlab?schema=public
JWT_ACCESS_SECRET=<your-secret-here>
JWT_REFRESH_SECRET=<your-secret-here>
WEBHOOK_SECRET=<your-secret-here>
```

Now simply run `pnpm install` and `pnpm start` to start the server
