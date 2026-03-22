'use client';

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { Profile } from './types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchingProfileRef = useRef<string | null>(null);
  const profileCacheRef = useRef<{ userId: string; profile: Profile; timestamp: number } | null>(null);
  const initialLoadCompleteRef = useRef(false);

  const fetchProfile = async (userId: string) => {
    if (!supabase) return null;

    const cache = profileCacheRef.current;
    if (cache && cache.userId === userId && Date.now() - cache.timestamp < 5000) {
      return cache.profile;
    }

    if (fetchingProfileRef.current === userId) return null;

    fetchingProfileRef.current = userId;

    let didTimeout = false;
    const timeoutId = setTimeout(() => { didTimeout = true; }, 10000);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      clearTimeout(timeoutId);
      if (didTimeout) { fetchingProfileRef.current = null; return null; }

      if (error) {
        console.error('Error fetching profile:', error);
        fetchingProfileRef.current = null;
        return null;
      }

      const profileData = data as Profile;
      profileCacheRef.current = { userId, profile: profileData, timestamp: Date.now() };
      fetchingProfileRef.current = null;
      return profileData;
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('fetchProfile error:', err);
      fetchingProfileRef.current = null;
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }

    let mounted = true;

    let authTimeoutId: NodeJS.Timeout | null = setTimeout(() => {
      if (mounted && loading) {
        initialLoadCompleteRef.current = true;
        setLoading(false);
      }
      authTimeoutId = null;
    }, 15000);

    supabase.auth.getSession()
      .then(async ({ data: { session }, error }) => {
        if (!mounted) return;
        if (authTimeoutId) { clearTimeout(authTimeoutId); authTimeoutId = null; }
        if (error) { console.error('Error getting session:', error); setLoading(false); return; }
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          if (mounted && profileData) setProfile(profileData);
        }
        initialLoadCompleteRef.current = true;
        if (mounted) setLoading(false);
      })
      .catch((err) => {
        console.error('Auth initialization error:', err);
        if (authTimeoutId) { clearTimeout(authTimeoutId); authTimeoutId = null; }
        if (mounted) setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;
        if (!initialLoadCompleteRef.current) {
          setSession(session);
          setUser(session?.user ?? null);
          return;
        }
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          if (mounted && profileData) setProfile(profileData);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      if (authTimeoutId) clearTimeout(authTimeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { display_name: displayName || email.split('@')[0] } },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!supabase || !user) return { error: new Error('Not authenticated') };
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (!error) await refreshProfile();
    return { error: error as Error | null };
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signUp, signIn, signOut, updateProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
