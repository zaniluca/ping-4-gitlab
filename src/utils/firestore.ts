import "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";

if (__DEV__) {
  firestore().useEmulator("localhost", 8081);
}

export default firestore();
