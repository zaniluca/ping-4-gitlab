import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  signInAnonymously as anonymousSignIn,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as Sentry from "sentry-expo";

import Logo from "../components/Logo";
import Skeleton from "../components/Skeleton";
import { useSecureStore } from "../hooks/use-secure-store";
import { auth, firestore } from "../utils/firebase";
import { http } from "../utils/http";
import { useTheme } from "../utils/theme";
import { User, UserData } from "../utils/types";

type AuthContextValues = {
  user: User;
  signInAnonymously: () => Promise<void>;
  signup: (e: string, p: string) => Promise<void>;
  login: (e: string, p: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValues>({
  user: null,
  signInAnonymously: async () => {},
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
  deleteUser: async () => {},
});

type AuthContextProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>(auth.currentUser);
  const { colors } = useTheme();
  const { setValueForKey, getValueForKey, deleteValueForKey } =
    useSecureStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth status changed: ", user);
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const migrateAccount = async (
    uid: string,
    email: string,
    password: string
  ) => {
    const docSnap = await getDoc(doc(firestore, `users/${uid}`));
    if (!docSnap.exists) throw new Error("User document does not exist");

    const data = docSnap.data() as UserData;

    console.log("Migrating account...");
    const hasMigrated = await getValueForKey("hasMigrated");
    try {
      if (!hasMigrated && data) {
        await http.post("/signup", {
          email,
          password,
          hookId: data.hook_id,
          onboardingCompleted: !data.onboarding,
        });
        console.log("Account migration completed");
        await setValueForKey("hasMigrated", "true");
      } else {
        console.log("Account migration not necessary");
      }
    } catch (error) {
      console.warn("Could not signup in new Backend: ", error);
      Sentry.Native.captureException(error);
    }
  };

  const deleteUser = async () => {
    try {
      await user?.delete();
      await deleteValueForKey("hasMigrated");
      console.log("Deleted user with id: ", user?.uid);
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  const signInAnonymously = async () => {
    try {
      const result = await anonymousSignIn(auth);
      console.log("Logged in anonymously with uid: ", result.user.uid);
    } catch (error) {
      if (error.code === "auth/operation-not-allowed") {
        console.log("Enable anonymous in your firebase console.");
      }
      console.error("Error signing in anonymously: ", error);
    }
  };

  const signup = async (e: string, p: string) => {
    if (user) {
      // Anonymous user trying to get a permanent account
      const credential = EmailAuthProvider.credential(e, p);
      const result = await linkWithCredential(user, credential);
      console.log("Anonymous user upgraded to permanent: ", result.user.uid);

      await migrateAccount(result.user.uid, e, p);
    } else {
      // New user
      const result = await createUserWithEmailAndPassword(auth, e, p);
      console.log("Signed up with uid: ", result.user.uid);

      await migrateAccount(result.user.uid, e, p);
    }
  };

  const login = async (e: string, p: string) => {
    const result = await signInWithEmailAndPassword(auth, e, p);
    await migrateAccount(result.user.uid, e, p);
    console.log("Logged in with uid: ", result.user.uid);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await deleteValueForKey("hasMigrated");
    } catch (error) {
      console.error("Error during logout: ", error);
    }
  };

  if (loading) {
    return (
      <Skeleton flex={1} alignItems="center" justifyContent="center">
        <Logo fill={colors.red} width={77} height={77} />
      </Skeleton>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signInAnonymously,
        signup,
        login,
        logout,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
