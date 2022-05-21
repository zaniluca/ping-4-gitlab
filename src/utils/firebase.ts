import * as FirebaseCore from "expo-firebase-core";
import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectAuthEmulator, getAuth } from "firebase/auth";

if (!FirebaseCore.DEFAULT_APP_OPTIONS)
  throw new Error(
    "Firebase wasn't correctly initialized! Remember to add google-services.json and GoogleService-info.plist to the root folder"
  );

const app = initializeApp(FirebaseCore.DEFAULT_APP_OPTIONS);

export const firestore = getFirestore(app);
export const auth = getAuth(app);

if (__DEV__ && !process.env.USE_ONLINE_FIRESTORE) {
  connectFirestoreEmulator(firestore, "localhost", 8081);
  connectAuthEmulator(auth, "http://localhost:9098");
}
