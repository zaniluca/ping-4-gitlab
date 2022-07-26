<p align="center">
 <img src="https://user-images.githubusercontent.com/59318963/167304601-eb5b48fa-f914-4fa7-ab3e-137b05827299.png" alt="Ping for Gitlab" width="84" height="84"> 
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

At the current state the backend (firebase) is not available for local testing so you can't test the app locally with a working backend. soon it will be available at the repo linked below.

Now that you've setup the client you may want to also setup the server to start locally testing the app. For this please refer to [this repo](https://github.com/zaniluca/ping-4-gitlab-firebase)

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md)
