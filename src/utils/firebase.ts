import * as FirebaseCore from "expo-firebase-core";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

if (!FirebaseCore.DEFAULT_APP_OPTIONS)
  throw new Error(
    "Firebase wasn't correctly initialized! Remember to add google-services.json and GoogleService-info.plist to the root folder"
  );

const app = initializeApp(FirebaseCore.DEFAULT_APP_OPTIONS);

export const firestore = getFirestore(app);
export const auth = getAuth(app);
