import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  onAuthStateChanged,
  signInAnonymously as anonymousSignIn,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { User } from "../utils/types";

type AuthContextValues = {
  user: User;
  loading: boolean;
  signInAnonymously: () => Promise<void>;
  signup: (e: string, p: string) => Promise<void>;
  login: (e: string, p: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValues>({
  user: null,
  loading: true,
  signInAnonymously: async () => {},
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
});

type AuthContextProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth status changed: ", user);
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
    } else {
      // New user
      const result = await createUserWithEmailAndPassword(auth, e, p);
      console.log("Signed up with uid: ", result.user.uid);
    }
  };

  const login = async (e: string, p: string) => {
    const result = await signInWithEmailAndPassword(auth, e, p);
    console.log("Logged in with uid: ", result.user.uid);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during logout: ", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInAnonymously, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
