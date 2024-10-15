'use client';

import React from 'react';
import { useProfile } from '@/lib/useProfile';

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useProfile();

  if (loading) {
    return <div>Loading...</div>;
  }

  return <ProfileContext.Provider value={profile}>{children}</ProfileContext.Provider>;
}

export const ProfileContext = React.createContext<any>(null);
