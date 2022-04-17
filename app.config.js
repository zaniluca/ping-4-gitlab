import "dotenv/config";

export default ({ config }) => {
  return {
    ...config,
    // extra: {
    //   firebaseApiKey: process.env.FIREBASE_API_KEY,
    //   firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    //   firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    //   firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    //   firebaseMessagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
    //   firebaseAppId: process.env.FIREBASE_MEASUREMENT_ID,
    //   firebaseMeasurementId: process.env.FIREBASE_APP_ID,
    // },
  };
};
