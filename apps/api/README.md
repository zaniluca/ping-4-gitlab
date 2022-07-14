# api-ping-4-gitlab

> Backend for the Ping for Gitlab app made in nodejs, typescript, express, prisma and MongoDB

## How to run

Create a `.env` file in the root of the project and add the following lines:

```
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/developmentDB
JWT_ACCESS_SECRET=<your-secret-here>
JWT_REFRESH_SECRET=<your-secret-here>
WEBHOOK_SECRET=<your-secret-here>
```

We're using [mongodb atlas](https://cloud.mongodb.com) as our database provider because `Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set`; which is doable in a local dev environment but it's quite a pain so this is the easiest way to get started

Now simply run `yarn install` and `yarn start` to start the server
