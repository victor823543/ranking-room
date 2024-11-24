import {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User } from "../types/User";
import { callAPI } from "../utils/apiService";

type AuthContextProps = {
  token: string | null;
  user: User | null | undefined;
  setToken: (newToken: string | null) => void;
  signNewToken: () => Promise<void>;
} | null;

type AuthProviderProps = {
  children: ReactElement;
};

type TokenResponse = {
  token: string;
};

const AuthContext = createContext<AuthContextProps>(null);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, _setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("token");
      setUser(null);
      return;
    }

    localStorage.setItem("token", token);

    callAPI<User>("/users/validate-token", "POST")
      .then((response) => {
        setUser(response);
      })
      .catch(() => {
        setUser(null);
      });
  }, [token]);

  // Centralized token setter with localStorage handling
  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
    _setToken(newToken);
    setUser(undefined); // Reset user until token validation happens
  };

  // Function to sign a new token
  const signNewToken = async () => {
    try {
      const response = await callAPI<TokenResponse>(
        "/users/sign-new-token",
        "POST",
      );
      setToken(response.token);
    } catch {
      setUser(null);
    }
  };

  const contextValue = useMemo(
    () => ({
      token,
      user,
      setToken,
      signNewToken,
    }),
    [token, user, signNewToken],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("Something went wrong...");
  }

  return context;
};

export default AuthProvider;
