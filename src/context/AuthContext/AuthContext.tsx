import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthState } from "./types";
import { createClient, Session } from "@supabase/supabase-js";

export const AuthContext = createContext<AuthState | null>(null);

export const useAuthContext = (): AuthState => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be within DataProvider");
  }

  return ctx;
};

export type AuthProviderProps = {
  children: ReactNode;
};

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL as string;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSignup = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log(data);

    if (error) {
      throw new Error("Error Occurred While Signing Up");
    }

    setLoading(false);
  };

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setSession(data.session);
    setLoading(false);
  };

  useEffect(() => {
    // 1. On mount, get the current session
    const getInitialSession = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (!error) {
        setSession(data.session);
        console.log(data.session);
      } else {
        console.error(error);
      }
      setLoading(false);
    };

    getInitialSession();

    // 2. Subscribe to auth changes (login, logout, refresh, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    // 3. Cleanup on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ handleLogin, handleSignup, loading, session }}
    >
      {children}
    </AuthContext.Provider>
  );
};
