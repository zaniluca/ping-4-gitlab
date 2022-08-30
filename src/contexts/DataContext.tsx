import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  createContext,
  PropsWithChildren,
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
  hasLoadedFirstSnapshot: boolean;
  updateNotification: (
    id: string,
    data: Partial<Notification>
  ) => Promise<void>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  getNotificationById: (id: string) => Promise<Notification | undefined>;
};

export const DataContext = createContext<DataContextValues>({
  notifications: [],
  hasLoadedFirstSnapshot: false,
  updateNotification: async (_id: string, _data: Partial<Notification>) => {},
  updateUserData: async (_data: Partial<UserData>) => {},
  getNotificationById: async (id: string) => Promise.resolve(undefined),
});

export const DataProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [hasLoadedFirstSnapshot, setHasLoadedFirstSnapshot] = useState(false);
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

  const getNotificationById = async (id: string) => {
    if (!user) return;
    console.log("Getting notification with id: ", id);

    const docSnap = await getDoc(
      doc(firestore, `users/${user.uid}/notifications/${id}`)
    );
    if (!docSnap.exists) return;

    const noti = docSnap.data() as Notification;
    noti.id = docSnap.id;
    return noti;
  };

  const updateNotification = async (
    id: string,
    data: Partial<Notification>
  ) => {
    if (!user) return;
    console.log(`Updating notification ${id} with data: `, data);

    try {
      await updateDoc(
        doc(firestore, `users/${user.uid}/notifications/${id}`),
        data
      );
    } catch (error) {
      console.error("Error trying to update notification: ", error);
    }
  };

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(firestore, `users/${user.uid}`), (doc) => {
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
    if (!user || !userData) return;
    const q = query(
      collection(firestore, `users/${user.uid}/notifications`),
      orderBy("recived", "desc"),
      limit(50)
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty && userData.onboarding) {
        // User is in onboarding stage and recived the confirmation email
        console.log(`${user.uid} added hook to gitlab succesfully`);
        updateUserData({ onboarding: false });
      }

      const docs: Notification[] = [];
      querySnapshot.forEach((doc) => {
        const noti = doc.data() as Notification;
        // Setting document id as notification id
        noti.id = doc.id;
        docs.push(noti);
      });

      setNotifications(docs);
      setHasLoadedFirstSnapshot(true);
    });

    return () => unsub();
  }, [user, userData]);

  return (
    <DataContext.Provider
      value={{
        notifications,
        userData,
        updateNotification,
        updateUserData,
        getNotificationById,
        hasLoadedFirstSnapshot,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
