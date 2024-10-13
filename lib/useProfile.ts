'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from './supabase';

export function useProfile() {
  const { isSignedIn, user } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrCreateProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create a new one
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              credits: 3,
              tier: 'free',
              stripe_customer_id: '',
              stripe_subscription_id: '',
            })
            .single();

          if (insertError) {
            console.error('Error creating user profile:', insertError);
          } else {
            setProfile(newProfile);
          }
        } else {
          console.error('Error fetching profile:', error);
        }
      } else {
        setProfile(data);
      }

      setLoading(false);
    }

    fetchOrCreateProfile();
  }, [user]);

  return { profile, loading };
}

export default useProfile;
