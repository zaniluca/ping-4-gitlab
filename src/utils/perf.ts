import { firebase } from "@react-native-firebase/perf";

async () => {
  // Disable performance monitoring if we are developing
  await firebase
    .perf()
    .setPerformanceCollectionEnabled(process.env.NODE_ENV === "production");
};
