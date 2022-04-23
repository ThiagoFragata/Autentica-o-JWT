import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/apiClient";

interface UserProps {
  email: string;
  permissions: string[];
  roles: string[];
}

interface SignImCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn: (credentials: SignImCredentials) => Promise<void>;
  signOut: () => void;
  user: UserProps | undefined;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export function signOut() {
  destroyCookie(undefined, "nextauth.token", { path: "/" });
  destroyCookie(undefined, "nextauth.refreshToken", { path: "/" });

  authChannel.postMessage("signOut");

  Router.push("/");
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>();
  const isAuthenticated = !!user;

  // realização do logout em paginas múltiplas
  useEffect(() => {
    authChannel = new BroadcastChannel("auth");

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case "signOut":
          destroyCookie(undefined, "nextauth.token", { path: "/" });
          destroyCookie(undefined, "nextauth.refreshToken", { path: "/" });

          Router.push("/");

          break;

        case "signIn":
          Router.push("/dashboard");
          break;
        default:
          break;
      }
    };
  }, []);

  // recuperar dados do user
  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      api
        .get("/me")
        .then((response) => {
          const { email, permissions, roles } = response.data;

          setUser({ email, permissions, roles });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignImCredentials) {
    try {
      const response = await api.post("sessions", {
        email,
        password,
      });

      const { token, refreshToken, permissions, roles } = response.data;

      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      setCookie(undefined, "nextauth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      setUser({
        email,
        permissions,
        roles,
      });

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      Router.push("/dashboard");

      authChannel.postMessage("signIn");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
