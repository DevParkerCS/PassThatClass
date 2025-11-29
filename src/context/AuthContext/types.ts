import { Session } from "@supabase/supabase-js";

export type AuthState = {
  handleLogin: (email: string, password: string) => Promise<void>;
  handleSignup: (email: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  loading: boolean;
  session: Session | null;
  needsVerify: boolean;
};
