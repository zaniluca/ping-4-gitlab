import { ExpoConfig, ConfigContext } from "@expo/config";
import { withGradleProperties } from "@expo/config-plugins";

const getIconForBuildEnv = () => {
  if (
    ["development", "staging", "preview"].includes(
      process.env.EAS_BUILD_PROFILE!
    )
  ) {
    return `./assets/icon-${process.env.EAS_BUILD_PROFILE}.png`;
  } else {
    return "./assets/app.icon";
  }
};

// Making the name and slug property coming from app.json required as they will always
// be present inside the configuration file
type CustomConfig = Omit<ConfigContext, "config"> & {
  config: Omit<ExpoConfig, "name" | "slug"> &
    Required<Pick<ExpoConfig, "name" | "slug">>;
};

export default ({ config }: CustomConfig): ExpoConfig => {
  const expoConfig: ExpoConfig = {
    ...config,
    ios: {
      ...config.ios,
      icon: getIconForBuildEnv(),
    },
    plugins: [
      ...(config.plugins || []),
      [
        "@sentry/react-native/expo",
        {
          organization: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "bdcab203-d9ce-48aa-95db-938dbfe1be17",
      },
    },
  };

  return withGradleProperties(expoConfig, (props) => {
    props.modResults = props.modResults.filter(
      (item) => !(item.type === "property" && item.key === "org.gradle.jvmargs")
    );
    props.modResults.push({
      type: "property",
      key: "org.gradle.jvmargs",
      value: "-Xmx4096m -XX:MaxMetaspaceSize=2048m",
    });
    return props;
  });
};
