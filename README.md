# Ping for Gitlab

[![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://github.com/expo/expo)
[![supports iOS](https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff)](https://itunes.apple.com/app/apple-store/id)
[![supports Android](https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff)](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www)

## Overview

- `assets/*` - Assets data like images and sounds.
- `src/components/*` - Collection of reusable components.
- `src/contexts/*` - React Contexts used to share data and logic throughout the app.
- `src/navigation/*` - Everything regarding navigation (we use [React Navigation](https://reactnavigation.org/))
- `src/screens/*` - App Views.
- `src/utils/*` - Shared utilities like validation functions, parsing, configurations etc.
- [`app.json`](app.json) - Expo configuration file ([app.config.js](app.config.js) only used for dynamic configuration)
- [`eas.json`](eas.json) - Configuration file used for [EAS Build service](https://docs.expo.dev/build/introduction/)
- [`App.tsx`](App.tsx) - Main entrypoint

## Running Locally

```bash
$ git clone https://github.com/zaniluca/ping-4-gitlab.git
$ cd ping-4-gitlab
$ nvm use
$ yarn
$ yarn start
```

## What Now?

Now that you've setup the client you may want to also setup the server to start locally testing the app. For this please refer to the [this readme](https://github.com/zaniluca/ping-4-gitlab-firebase/blob/master/README.md)
