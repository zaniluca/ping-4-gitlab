# Ping for Gitlab API

> Backend for the Ping for Gitlab app made in nodejs, typescript, honojs, drizzle and D1

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/zaniluca/api-ping-4-gitlab)

## How to run

Create a `.env` file in the root of the project following the `.env.example` file.

> Note: The `ANDROID_EMULATOR` variable is used to determine if the app is running on an android emulator or not. This is used to determine the correct redirect url for the gitlab oauth flow.

Now simply run `pnpm install` and `pnpm dev` to start the server

## License

This project is licensed under the GNU Affero General Public License v3.0. See the [LICENSE](./LICENSE) file for details.
