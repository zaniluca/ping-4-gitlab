<div style="text-align:center">
<a href="#"><img src="https://imgur.com/a/IIl84vW" style="display:block; margin:auto; width:100%; max-width:100%"/></a>
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
