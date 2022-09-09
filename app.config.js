import "dotenv/config";

const getIconFromEnv = () => {
  switch (process.env.EAS_BUILD_PROFILE) {
    case ("development", "staging", "preview"):
      return `./assets/icon-${process.env.EAS_BUILD_PROFILE}.png`;
    default:
      return "./assets/icon.png";
  }
};

export default ({ config }) => {
  return {
    ...config,
    icon: getIconFromEnv(),
    hooks: {
      postPublish: [
        {
          file: "sentry-expo/upload-sourcemaps",
          config: {
            organization: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            authToken: process.env.SENTRY_AUTH_TOKEN,
            setCommits: true,
          },
        },
      ],
    },
  };
};
