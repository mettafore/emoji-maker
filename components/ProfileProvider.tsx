'use client';

import React from 'react';
import { useProfile } from '@/lib/useProfile';

// Define a type for the profile
export interface Profile {
  user_id: string;
  credits: number;
  tier: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  // The id field might be automatically added by Supabase, so we'll include it
  id?: string;
}

// Update the context type
export const ProfileContext = React.createContext<Profile | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useProfile();

  if (loading) {
    return <div>Loading...</div>;
  }

  return <ProfileContext.Provider value={profile}>{children}</ProfileContext.Provider>;
}
