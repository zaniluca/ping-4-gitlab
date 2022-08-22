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
    extra: {
      // Needed for the Local CI Build to work
      eas: {
        projectId: "bdcab203-d9ce-48aa-95db-938dbfe1be17",
      },
    },
  };
};
