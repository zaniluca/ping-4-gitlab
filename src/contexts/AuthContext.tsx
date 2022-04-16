import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInAnonymously as anonymousSignIn,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { User } from "../utils/types/types";

type AuthContextValues = {
  user: User;
  signInAnonymously: VoidFunction;
};

export const AuthContext = createContext<AuthContextValues>({
  user: null,
  signInAnonymously: () => {},
});

type AuthContextProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [user, setUser] = useState<User>(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth status changed: ", user);
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const signInAnonymously = async () => {
    try {
      const user = await anonymousSignIn(auth);

      console.log("Logged in with uid: ", user.user.uid);
    } catch (error) {
      if (error.code === "auth/operation-not-allowed") {
        console.log("Enable anonymous in your firebase console.");
      }

      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signInAnonymously }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
