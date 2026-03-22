'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Board, Category, Item } from '@/lib/types';
import { formatPrice } from '@/lib/constants';

export default function SharedBoardPage() {
  const params = useParams();
  const token = params.token as string;

  const [board, setBoard] = useState<Board | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [itemsByCategory, setItemsByCategory] = useState<Record<string, Item[]>>({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      if (!supabase) { setLoading(false); return; }

      // Find board by share token
      const { data: boardData, error } = await supabase
        .from('boards')
        .select('*')
        .eq('share_token', token)
        .eq('is_public', true)
        .single();

      if (error || !boardData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const board = boardData as Board;
      setBoard(board);

      const [catRes, itemsRes] = await Promise.all([
        supabase.from('categories').select('*').eq('board_id', board.id).order('sort_order'),
        supabase.from('items').select('*').eq('board_id', board.id).order('sort_order'),
      ]);

      setCategories((catRes.data || []) as Category[]);

      const grouped: Record<string, Item[]> = {};
      for (const item of (itemsRes.data || []) as Item[]) {
        if (!grouped[item.category_id]) grouped[item.category_id] = [];
        grouped[item.category_id].push(item);
      }
      setItemsByCategory(grouped);
      setLoading(false);
    }
    load();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Board not found</h1>
          <p className="text-gray-500">This board may have been removed or is no longer shared.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <span className="text-xs text-gray-400 uppercase tracking-wide">Shared Board</span>
        <h1 className="text-2xl font-bold text-gray-900">{board?.title}</h1>
        {board?.description && <p className="text-gray-600 mt-1">{board.description}</p>}
      </div>

      <div className="space-y-6">
        {categories.map(category => (
          <div key={category.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-900 mb-3">{category.name}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {(itemsByCategory[category.id] || []).map(item => (
                <div key={item.id} className="rounded-lg border border-gray-200 overflow-hidden">
                  <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name || 'Item'}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="px-2 py-1.5 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-gray-700 truncate font-medium">{item.name || 'Untitled'}</p>
                    {item.price && (
                      <p className="text-xs text-gray-500">{formatPrice(item.price, item.currency)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
