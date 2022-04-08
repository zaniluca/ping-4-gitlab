import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import firebaseAuth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

type User = FirebaseAuthTypes.User;

type AuthContextValues = {
  user?: User | null;
  signInAnonymously: VoidFunction;
};

export const AuthContext = createContext<AuthContextValues>({
  signInAnonymously: () => {},
});

type AuthContextProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>();
  const auth = firebaseAuth();

  const authStateChanged = (u: User | null) => {
    setUser(u);
    console.log("Auth state changed: ", user);
  };

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(authStateChanged);
    return subscriber;
  }, []);

  const signInAnonymously = async () => {
    try {
      const user = await auth.signInAnonymously();
      console.log("Signed in anonymously");
      console.log(user);
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
