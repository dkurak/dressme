'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Logged in users go straight to boards
  if (user) {
    return (
      <div className="min-h-[60vh]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Boards</h1>
          <Link
            href="/boards/new"
            className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            + New Board
          </Link>
        </div>
        <BoardsList />
      </div>
    );
  }

  // Landing page for logged out users
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Build the perfect outfit.
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-lg">
        Mix and match pieces from your wardrobe and online stores.
        Compare combinations side by side. Run tournaments to find your favorite.
      </p>
      <div className="flex gap-3">
        <Link
          href="/signup"
          className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Sign In
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
        <div className="bg-white rounded-xl p-6 border border-gray-200 text-left">
          <div className="text-2xl mb-3">+</div>
          <h3 className="font-semibold text-gray-900 mb-1">Add Pieces</h3>
          <p className="text-sm text-gray-600">
            Upload photos of dresses, shoes, jewelry — anything. Mix owned items with online finds.
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 text-left">
          <div className="text-2xl mb-3">&#x2194;</div>
          <h3 className="font-semibold text-gray-900 mb-1">Compare Looks</h3>
          <p className="text-sm text-gray-600">
            Auto-generate every combination. Swipe through outfits or run a head-to-head tournament.
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 text-left">
          <div className="text-2xl mb-3">&#10003;</div>
          <h3 className="font-semibold text-gray-900 mb-1">Decide & Buy</h3>
          <p className="text-sm text-gray-600">
            Crown your champion outfit. See what you own and what you need to buy.
          </p>
        </div>
      </div>
    </div>
  );
}

// Boards list component (inline for now)
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Board } from '@/lib/types';

function BoardsList() {
  const { user } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBoards() {
      if (!supabase || !user) { setLoading(false); return; }
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) console.error('Error loading boards:', error);
      setBoards(data || []);
      setLoading(false);
    }
    loadBoards();
  }, [user]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
            <div className="h-4 bg-gray-100 rounded w-full mb-2" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (boards.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500 mb-4">No boards yet. Create one to get started!</p>
        <Link
          href="/boards/new"
          className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors inline-block"
        >
          + Create Your First Board
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {boards.map(board => (
        <Link
          key={board.id}
          href={`/boards/${board.id}`}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-gray-900 mb-1">{board.title}</h3>
          {board.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{board.description}</p>
          )}
          <p className="text-xs text-gray-400 mt-3">
            Updated {new Date(board.updated_at).toLocaleDateString()}
          </p>
        </Link>
      ))}
    </div>
  );
}
