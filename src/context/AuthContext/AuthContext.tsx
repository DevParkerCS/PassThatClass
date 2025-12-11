import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AuthState, ProfileResponse } from "./types";
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
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const loadedProfile = useRef(false);
  const [bannerOpen, setBannerOpen] = useState(false);

  const resetAuthState = () => {
    setSession(null);
    setLoading(false);
    setNeedsVerify(false);
    setAuthError(null);
    setProfile(null);
    loadedProfile.current = false;
    setBannerOpen(false);
  };

  useEffect(() => {
    if (!profile) return;

    setBannerOpen(
      profile.generations_remaining_this_period <= 0 &&
        profile.plan.id === "free"
    );
  }, [profile]);

  useEffect(() => {
    if (authError === undefined) return;

    if (authError?.code === "email_not_confirmed") setNeedsVerify(true);
  }, [authError]);

  useEffect(() => {
    if (!loading && session && !loadedProfile.current) {
      loadProfile();
    }
  }, [session, loading]);

  const loadProfile = async () => {
    setLoading(true);
    loadedProfile.current = true;
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_API}/user/profile`,
        {
          headers: {
            Authorization: session?.access_token
              ? `Bearer ${session.access_token}`
              : "",
          },
        }
      );

      const data: ProfileResponse = res.data;
      setProfile(data);

      console.log(res.data);
      setLoading(false);
    } catch (e) {
      loadedProfile.current = false;
      console.error(e);
      setLoading(false);
    }
  };

  const decrementGenerations = () => {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        generations_remaining_this_period:
          prev.generations_remaining_this_period - 1,
      };
    });
  };
  const incrementGenerations = () => {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        generations_remaining_this_period:
          prev.generations_remaining_this_period + 1,
      };
    });
  };

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
    resetAuthState();
    setSession(null);
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

  const authMemo: AuthState = useShallowMemo({
    handleLogin,
    handleSignup,
    handleLogout,
    resendVerification,
    decrementGenerations,
    incrementGenerations,
    bannerOpen,
    setBannerOpen,
    loading,
    session,
    needsVerify,
    profile,
    resetAuthState,
  });

  return (
    <AuthContext.Provider value={authMemo}>{children}</AuthContext.Provider>
  );
};
