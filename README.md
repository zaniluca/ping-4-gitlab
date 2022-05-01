<div align="center">
  <h1>Ping For Gitlab</h1>
  <p>Multiplatform react-native app that sends you instant notifications about your GitLab activities</p>
    <p>
    <img alt="Runs with Expo" longdesc="Runs with Expo" src="https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://github.com/expo/expo" />
    <img alt="Supports Expo iOS" longdesc="Supports Expo iOS" src="https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff" />
  <img alt="Supports Expo Android" longdesc="Supports Expo Android" src="https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff" />
    </p>
</div>

## Installation

To install the dependencies you must be on the correct version of nodejs (specified inside [.nvmrc](.nvmrc)).

We recommend using [nvm](https://github.com/nvm-sh/nvm) for managing multiple node versions.

```shell
nvm use
```

The when you're on the correct version of node simply run

```bash
yarn install # or npm install
```

You're almost done, now you need to make a copy of the environment variables by running

```shell
cp .env.example .env
```

## What Now?

Now that you've setup the client you may want to also setup the server to start locally testing the app. For this please refer to the [Server Repository README](https://github.com/zaniluca/ping-4-gitlab-firebase/blob/master/README.md)
