<p align="center">
 <img src="https://user-images.githubusercontent.com/59318963/187087277-524b1e3b-b7cf-406c-8ed9-500a18c23867.png" alt="Ping for Gitlab" width="84" height="84">
</p>

# Ping for Gitlab

> Receive instant push notifications directly from GitLab to your devices. Ping for GitLab is the best way to stay up to date with your team

[![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://github.com/expo/expo)
[![supports iOS](https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff)](https://apps.apple.com/it/app/ping-for-gitlab/id1620904531)
[![supports Android](https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff)](https://play.google.com/store/apps/details?id=com.zaniluca.ping4gitlab)

## Workspace

- [`apps/mobile`](apps/mobile) contains the Expo SDK 58 app, React Native source, assets, and EAS configuration.
- [`apps/api`](apps/api) contains the Hono API, Cloudflare Worker configuration, and D1 migrations.

## Running locally

Use the Node version in `.nvmrc` and the pnpm version pinned in the root `package.json`.

```sh
nvm use
pnpm install --frozen-lockfile
```

Copy `apps/mobile/.env.example` to `apps/mobile/.env` and `apps/api/.env.example` to `apps/api/.env`. Fill in the local API secrets before proceeding. See the [API README](apps/api/README.md) for local configuration and test data.

From the workspace root, initialize the local database and start Expo and Wrangler together.

```sh
pnpm --filter api-ping-4-gitlab db:migrate:local
pnpm dev
```

Expo starts on port 8081 and the API starts on port 8787. Open the project in Expo Go SDK 58. Check API readiness with `curl --fail http://localhost:8787/health`.

If port 8787 is in use, start the API on a free port and point Expo at it. On the iOS simulator, for example, run `API_PORT=18787 EXPO_PUBLIC_API_URL=http://localhost:18787 pnpm dev`. Android emulators use `10.0.2.2` for the host machine. On a physical device, use the development machine's LAN address and configure Wrangler to listen on that interface.

Run `pnpm lint`, `pnpm typecheck`, and `pnpm test` from the root. The lint script checks the mobile app and the test script runs the API suite. For a Worker build without deployment, run `pnpm --filter api-ping-4-gitlab build`.

Run EAS commands from `apps/mobile`, where `eas.json` lives. For local Android native builds, place the Firebase configuration at `apps/mobile/google-services.json`.

The API workflows run from `apps/api`. Configure their Cloudflare credentials and the `API_SENTRY_AUTH_TOKEN`, `API_SENTRY_ORG`, and `API_SENTRY_PROJECT` secrets in this repository before deploying the Worker from GitHub Actions.

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md)

## License

This project is licensed under the GNU Affero General Public License v3.0. See the [LICENSE](./LICENSE) file for details.
