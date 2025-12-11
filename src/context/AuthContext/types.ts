import { Session } from "@supabase/supabase-js";
import { Dispatch, SetStateAction } from "react";

export type AuthState = {
  handleLogin: (email: string, password: string) => Promise<void>;
  handleSignup: (email: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  decrementGenerations: () => void;
  incrementGenerations: () => void;
  setBannerOpen: Dispatch<SetStateAction<boolean>>;
  resetAuthState: () => void;
  bannerOpen: boolean;
  loading: boolean;
  session: Session | null;
  needsVerify: boolean;
  profile: ProfileResponse | null;
};

export type SubscriptionStatus = "none" | "active" | "past_due" | "canceled";

export interface Plan {
  id: "free" | "pro";
  name: string;
  monthly_generation_limit: number;
  price_cents: number;
  image_limit: number;
  char_limit: number;
  class_limit: number;
}

export interface ProfileResponse {
  plan_id: string;
  subscription_status: SubscriptionStatus;
  lifetime_generations: number;

  current_period_start: string | null;
  current_period_end: string | null;

  generations_used_this_period: number;
  generations_remaining_this_period: number;

  plan: Plan;
}
