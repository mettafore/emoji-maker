'use client';

import React from 'react';
import { useProfile } from '@/lib/useProfile';

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useProfile();

  if (loading) {
    return <div>Loading...</div>;
  }

  // You can pass the profile data to children components if needed
  return <>{children}</>;
}