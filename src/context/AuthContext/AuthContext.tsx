import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthState } from "./types";
import { AuthError, createClient, Session } from "@supabase/supabase-js";
import { useShallowMemo } from "../../hooks/useShallowMemo";

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
  const [needsVerify, setNeedsVerify] = useState(false);
  const [authError, setAuthError] = useState<AuthError | null>(null);

  useEffect(() => {
    if (authError === undefined) return;

    if (authError?.code === "email_not_confirmed") setNeedsVerify(true);
  }, [authError]);

  const resendVerification = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/email-confirmed`,
      },
    });

    if (error) {
      console.error("Error resending verification", error);
      throw new Error(error.message || "Error resending verification email");
    }
  };

  useEffect(() => {
    console.log("SESSION:" + session);
  }, [session]);

  const handleSignup = async (email: string, password: string) => {
    if (loading) return;

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/email-confirmed`,
      },
    });

    if (!error) {
      setNeedsVerify(true);
    }
    setAuthError(error);

    if (error) {
      throw new Error("Error Occurred While Signing Up");
    }

    setLoading(false);
  };

  const handleLogin = async (email: string, password: string) => {
    if (loading) return;

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log(error);

    setAuthError(error);

    setSession(data.session);
    setLoading(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    setAuthError(error);
  };

  useEffect(() => {
    // 1. On mount, get the current session
    const getInitialSession = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      setSession(data.session);
      setAuthError(error);
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

  const authMemo = useShallowMemo({
    handleLogin,
    handleSignup,
    handleLogout,
    resendVerification,
    loading,
    session,
    needsVerify,
  });

  return (
    <AuthContext.Provider value={authMemo}>{children}</AuthContext.Provider>
  );
};
