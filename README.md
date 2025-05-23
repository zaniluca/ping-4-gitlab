<p align="center">
 <img src="https://user-images.githubusercontent.com/59318963/187087277-524b1e3b-b7cf-406c-8ed9-500a18c23867.png" alt="Ping for Gitlab" width="84" height="84">
</p>

# Ping for Gitlab

> Receive instant push notifications directly from GitLab to your devices. Ping for GitLab is the best way to stay up to date with your team

[![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://github.com/expo/expo)
[![supports iOS](https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff)](https://apps.apple.com/it/app/ping-for-gitlab/id1620904531)
[![supports Android](https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff)](https://play.google.com/store/apps/details?id=com.zaniluca.ping4gitlab)

## Overview

The app is build using Expo and React Native, the entire codebase is written in Typescript and uses [restyle](https://github.com/Shopify/restyle) for styling.

### File Structure

- `assets/*` - Assets data like images and sounds.
- `src/components/*` - Collection of reusable components.
- `src/contexts/*` - React Contexts used to share data and logic throughout the app.
- `src/navigation/*` - Everything regarding navigation (we use [React Navigation](https://reactnavigation.org/))
- `src/screens/*` - App Views.
- `src/utils/*` - Shared utilities like validation functions, parsing, configurations etc.
- `app.json` - Expo configuration file ([app.config.js](app.config.js) only used for dynamic configuration)
- `eas.json` - Configuration file used for [EAS Build service](https://docs.expo.dev/build/introduction/)
- `App.tsx` - Main entrypoint

## Running Locally

```
git clone https://github.com/zaniluca/ping-4-gitlab.git
cd ping-4-gitlab
nvm use
yarn
yarn start
```

## What Now?

Now that you've setup the client you may want to also setup the server to start locally testing the app. For this please refer to [this repo](https://github.com/zaniluca/api-ping-4-gitlab)

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md)

## License

This project is licensed under the GNU Affero General Public License v3.0. See the [LICENSE](./LICENSE) file for details.
