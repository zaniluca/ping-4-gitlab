import "dotenv/config";
import { ExpoConfig, ConfigContext } from "@expo/config";

const getIconForBuildEnv = () => {
  if (
    ["development", "staging", "preview"].includes(
      process.env.EAS_BUILD_PROFILE
    )
  ) {
    return `./assets/icon-${process.env.EAS_BUILD_PROFILE}.png`;
  } else {
    return "./assets/icon.png";
  }
};

// Making the name and slug property coming from app.json required as they will always
// be present inside the configuration file
type CustomConfig = Omit<ConfigContext, "config"> & {
  config: Omit<ExpoConfig, "name" | "slug"> &
    Required<Pick<ExpoConfig, "name" | "slug">>;
};

export default ({ config }: CustomConfig): ExpoConfig => ({
  ...config,
  icon: getIconForBuildEnv(),
  hooks: {
    postPublish: [
      {
        file: "sentry-expo/upload-sourcemaps",
        config: {
          organization: process.env.SENTRY_ORG!,
          project: process.env.SENTRY_PROJECT!,
          authToken: process.env.SENTRY_AUTH_TOKEN!,
          setCommits: true,
        },
      },
    ],
  },
});
