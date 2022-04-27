import "dotenv/config";

export default ({ config }) => {
  return {
    ...config,
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
