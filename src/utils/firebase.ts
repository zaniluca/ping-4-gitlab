import * as FirebaseCore from "expo-firebase-core";

if (!FirebaseCore.DEFAULT_APP_OPTIONS)
  throw new Error(
    "Firebase wasn't correctly initialized! Remember to add google-services.json and GoogleService-info.plist to the root folder"
  );
