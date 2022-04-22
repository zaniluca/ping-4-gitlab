import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
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
  updateNotification: (
    id: string,
    data: Partial<Notification>
  ) => Promise<void>;
};

export const DataContext = createContext<DataContextValues>({
  notifications: [],
  updateNotification: async (id: string, data: Partial<Notification>) => {},
});

type DataContextProps = {
  children: ReactNode;
};

export const DataProvider: React.FC<DataContextProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userData, setUserData] = useState<UserData>();

  const { user } = useAuth();

  const initializeUserDocument = async () => {
    if (!user) return;
    console.log("Initializing user document with id: ", user.uid);

    try {
      await setDoc(doc(firestore, `users/${user.uid}`), {
        hook_id: generateUniqueHook(),
        onboarding: true,
      });
    } catch (error) {
      console.error("Error trying to initialize user document: ", error);
    }
  };

  const updateUserData = async (data: Partial<UserData>) => {
    if (!user) return;
    console.log(`Updating user document ${user.uid} with data: `, data);

    try {
      await updateDoc(doc(firestore, `users/${user.uid}`), data);
    } catch (error) {
      console.error("Error trying to update user document: ", error);
    }
  };

  const updateNotification = async (
    id: string,
    data: Partial<Notification>
  ) => {
    if (!user) return;
    console.log(`Updating notification ${id} with data: `, data);

    try {
      await updateDoc(
        doc(firestore, `users/${"test"}/notifications/${id}`),
        data
      );
    } catch (error) {
      console.error("Error trying to update notification: ", error);
    }
  };

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(firestore, `users/${"test"}`), (doc) => {
      const data = doc.data() as UserData;

      if (!data) {
        // If the user document doesn't already exist create a new one
        initializeUserDocument();
      }

      console.log("User data: ", data);
      setUserData(data);
    });

    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(firestore, `users/${"test"}/notifications`),
      orderBy("recived", "desc")
    );
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
        updateUserData({ onboarding: false });
      }

      setNotifications(docs);
    });

    return () => unsub();
  }, [user]);

  return (
    <DataContext.Provider
      value={{ notifications, userData, updateNotification }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
