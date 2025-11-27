import { Session } from "@supabase/supabase-js";

export type AuthState = {
  handleLogin: (email: string, password: string) => Promise<void>;
  handleSignup: (email: string, password: string) => Promise<void>;
  loading: boolean;
  session: Session | null;
};
