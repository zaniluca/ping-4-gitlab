# Ping for Gitlab API

> Backend for the Ping for Gitlab app made in nodejs, typescript, honojs, drizzle and D1

## Running locally

Create `apps/api/.env` from [`.env.example`](.env.example) and set the local signing secrets. Run these commands from the workspace root.

```sh
pnpm install --frozen-lockfile
pnpm --filter api-ping-4-gitlab db:migrate:local
pnpm --filter api-ping-4-gitlab dev
```

Use `pnpm dev` from the workspace root to start both Expo and the API. The default API URL is `http://localhost:8787`.

For a fresh local database, `pnpm --filter api-ping-4-gitlab db:seed` creates test accounts and sample inbox notifications. The seed script replaces all users and notifications in the worktree's local database. The test accounts are defined in [`src/db/seed.ts`](src/db/seed.ts).

For GitLab OAuth, configure the OAuth client and set the local `GITLAB_REDIRECT_URI` to the callback registered with that client. Set `ANDROID_EMULATOR` when testing the callback with an Android emulator.

## License

This project is licensed under the GNU Affero General Public License v3.0. See the [LICENSE](./LICENSE) file for details.
