import * as FirebaseCore from "expo-firebase-core";
import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { Platform } from "react-native";

if (!FirebaseCore.DEFAULT_APP_OPTIONS)
  throw new Error(
    "Firebase wasn't correctly initialized! Remember to add google-services.json and GoogleService-info.plist to the root folder"
  );

const app = initializeApp(FirebaseCore.DEFAULT_APP_OPTIONS);

export const firestore = getFirestore(app);
export const auth = getAuth(app);

if (__DEV__ && !process.env.USE_ONLINE_FIRESTORE) {
  // 10.0.2.2 is the special host for accessing localhost via android emulator
  // https://firebase.google.com/docs/emulator-suite/connect_and_prototype#android_1
  const host = Platform.OS === "android" ? "10.0.2.2" : "localhost";
  console.log("Using local emulators on host: ", host);
  // Maybe we need to use this if we want expo-go to work
  //   Constants.manifest?.debuggerHost?.split(":").shift() || "localhost";
  connectAuthEmulator(auth, `http://${host}:9098`);
  connectFirestoreEmulator(firestore, host, 8081);
}
