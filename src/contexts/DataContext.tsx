import { collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { firestore } from "../utils/firebase";
import generateUniqueHook from "../utils/hook-generator";
import { Notification, UserData } from "../utils/types";
import { useAuth } from "./AuthContext";

type DataContextValues = {
  notifications: Notification[];
  userData?: UserData;
};

export const DataContext = createContext<DataContextValues>({
  notifications: [],
});

type DataContextProps = {
  children: ReactNode;
};

export const DataProvider: React.FC<DataContextProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userData, setUserData] = useState<UserData>();

  const { user } = useAuth();

  const initializeUserDocument = async (uid: string) => {
    console.log("Initializing user document with id: ", uid);
    await setDoc(doc(firestore, `users/${uid}`), {
      hook_id: generateUniqueHook(),
      onboarding: true,
    });
  };

  const completeOnboarding = async (uid: string) => {
    console.log("Compleating onboarding for user: ", uid);
    await setDoc(
      doc(firestore, `users/${uid}`),
      {
        onboarding: false,
      },
      { merge: true }
    );
  };

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(firestore, `users/${user.uid}`), (doc) => {
      const data = doc.data() as UserData;

      if (!data) {
        // If the user document doesn't already exist create a new one
        initializeUserDocument(user.uid)
          .then(() => console.log("User Document initialized"))
          .catch((e) => console.error(e));
      }

      console.log("User data: ", data);
      setUserData(data);
    });

    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(firestore, `users/${"test"}/notifications`));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let docs: Notification[] = [];
      querySnapshot.forEach((doc) => {
        const noti = doc.data() as Notification;
        // Setting document id as notification id
        noti.id = doc.id;
        docs.push(noti);
      });

      if (!!notifications.length && userData?.onboarding) {
        // User is in onboarding stage and recived the confirmation email
        completeOnboarding(user.uid)
          .then(() => console.log("Onboarding completed"))
          .catch((e) => console.error(e));
      }

      setNotifications(docs);
    });

    return () => unsub();
  }, [user]);

  return (
    <DataContext.Provider value={{ notifications, userData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
