'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Board, Category, Item } from '@/lib/types';
import { countCombinations, generateOutfits } from '@/lib/outfits';
import { ItemUpload } from '@/components/items/ItemUpload';
import { ItemCard } from '@/components/items/ItemCard';

export default function BoardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const boardId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [board, setBoard] = useState<Board | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [itemsByCategory, setItemsByCategory] = useState<Record<string, Item[]>>({});
  const [lockedItems, setLockedItems] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  const loadBoard = useCallback(async () => {
    if (!supabase || !boardId) return;

    const [boardRes, catRes, itemsRes] = await Promise.all([
      supabase.from('boards').select('*').eq('id', boardId).single(),
      supabase.from('categories').select('*').eq('board_id', boardId).order('sort_order'),
      supabase.from('items').select('*').eq('board_id', boardId).order('sort_order'),
    ]);

    if (boardRes.error || !boardRes.data) {
      router.push('/');
      return;
    }

    setBoard(boardRes.data as Board);
    setCategories((catRes.data || []) as Category[]);

    // Group items by category
    const grouped: Record<string, Item[]> = {};
    for (const item of (itemsRes.data || []) as Item[]) {
      if (!grouped[item.category_id]) grouped[item.category_id] = [];
      grouped[item.category_id].push(item);
    }
    setItemsByCategory(grouped);

    // Restore locks from items
    const locks: Record<string, string> = {};
    for (const item of (itemsRes.data || []) as Item[]) {
      if (item.is_locked) locks[item.category_id] = item.id;
    }
    setLockedItems(locks);

    setLoading(false);
  }, [boardId, router]);

  useEffect(() => {
    if (!authLoading) loadBoard();
  }, [authLoading, loadBoard]);

  const toggleLock = async (categoryId: string, itemId: string) => {
    if (!supabase) return;

    const newLocks = { ...lockedItems };
    if (newLocks[categoryId] === itemId) {
      delete newLocks[categoryId];
      await supabase.from('items').update({ is_locked: false }).eq('id', itemId);
    } else {
      // Unlock previous item in this category if any
      if (newLocks[categoryId]) {
        await supabase.from('items').update({ is_locked: false }).eq('id', newLocks[categoryId]);
      }
      newLocks[categoryId] = itemId;
      await supabase.from('items').update({ is_locked: true }).eq('id', itemId);
    }
    setLockedItems(newLocks);
  };

  const handleItemUploaded = async (categoryId: string, url: string, path: string) => {
    if (!supabase || !user) return;

    const { data, error } = await supabase
      .from('items')
      .insert({
        board_id: boardId,
        category_id: categoryId,
        image_url: url,
        image_path: path,
        sort_order: (itemsByCategory[categoryId]?.length || 0),
      })
      .select()
      .single();

    if (!error && data) {
      setItemsByCategory(prev => ({
        ...prev,
        [categoryId]: [...(prev[categoryId] || []), data as Item],
      }));
    }
  };

  const handleItemUpdate = async (itemId: string, updates: Partial<Item>) => {
    if (!supabase) return;
    await supabase.from('items').update(updates).eq('id', itemId);
    // Refresh
    loadBoard();
  };

  const handleItemDelete = (categoryId: string, itemId: string) => {
    setItemsByCategory(prev => ({
      ...prev,
      [categoryId]: (prev[categoryId] || []).filter(i => i.id !== itemId),
    }));
    // Remove lock if deleted item was locked
    if (lockedItems[categoryId] === itemId) {
      const newLocks = { ...lockedItems };
      delete newLocks[categoryId];
      setLockedItems(newLocks);
    }
  };

  const addCategory = async () => {
    if (!supabase || !newCategoryName.trim()) return;
    setAddingCategory(true);

    const { data, error } = await supabase
      .from('categories')
      .insert({
        board_id: boardId,
        name: newCategoryName.trim(),
        sort_order: categories.length,
      })
      .select()
      .single();

    if (!error && data) {
      setCategories(prev => [...prev, data as Category]);
      setNewCategoryName('');
    }
    setAddingCategory(false);
  };

  const deleteCategory = async (categoryId: string) => {
    if (!supabase) return;
    if (!confirm('Delete this category and all its items?')) return;
    await supabase.from('categories').delete().eq('id', categoryId);
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    const newItems = { ...itemsByCategory };
    delete newItems[categoryId];
    setItemsByCategory(newItems);
  };

  const handleGenerate = async () => {
    if (!supabase) return;
    setGenerating(true);

    const outfits = generateOutfits({ categories, itemsByCategory, lockedItems });

    if (outfits.length === 0) {
      alert('Cannot generate outfits. Make sure each category has at least one item.');
      setGenerating(false);
      return;
    }

    // Delete old generated outfits for this board
    await supabase.from('outfits').delete().eq('board_id', boardId);

    // Insert new outfits
    for (const outfit of outfits) {
      const { data: outfitRow, error: outfitError } = await supabase
        .from('outfits')
        .insert({ board_id: boardId })
        .select()
        .single();

      if (outfitError || !outfitRow) continue;

      const outfitItems = Object.entries(outfit.items).map(([categoryId, itemId]) => ({
        outfit_id: outfitRow.id,
        item_id: itemId,
        category_id: categoryId,
      }));

      await supabase.from('outfit_items').insert(outfitItems);
    }

    setGenerating(false);
    router.push(`/boards/${boardId}/outfits`);
  };

  const deleteBoard = async () => {
    if (!supabase) return;
    if (!confirm('Delete this board and everything in it?')) return;
    await supabase.from('boards').delete().eq('id', boardId);
    router.push('/');
  };

  const comboCount = countCombinations(categories, itemsByCategory, lockedItems);
  const hasItems = Object.values(itemsByCategory).some(items => items.length > 0);

  if (loading || authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!board) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">&larr; All Boards</Link>
          <h1 className="text-2xl font-bold text-gray-900">{board.title}</h1>
          {board.description && <p className="text-gray-600 mt-1">{board.description}</p>}
        </div>
        <div className="flex gap-2">
          {board.share_token && (
            <button
              onClick={() => {
                const url = `${window.location.origin}/shared/${board.share_token}`;
                navigator.clipboard.writeText(url);
                alert('Share link copied!');
              }}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Share
            </button>
          )}
          <button
            onClick={deleteBoard}
            className="px-3 py-2 text-sm text-red-600 bg-white border border-gray-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Generate bar */}
      {hasItems && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {comboCount > 0 ? `${comboCount} outfit combination${comboCount !== 1 ? 's' : ''}` : 'Lock items to generate outfits'}
            </p>
            <p className="text-xs text-gray-500">
              Lock items you&apos;ve decided on. Unlocked slots will be mixed & matched.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/boards/${boardId}/outfits`}
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Outfits
            </Link>
            <button
              onClick={handleGenerate}
              disabled={generating || comboCount === 0}
              className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {generating ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-6">
        {categories.map(category => (
          <div key={category.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">{category.name}</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {(itemsByCategory[category.id] || []).length} item{(itemsByCategory[category.id] || []).length !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Items grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-3">
              {(itemsByCategory[category.id] || []).map(item => (
                <ItemCard
                  key={item.id}
                  item={item}
                  isLocked={lockedItems[category.id] === item.id}
                  onToggleLock={() => toggleLock(category.id, item.id)}
                  onDelete={() => handleItemDelete(category.id, item.id)}
                  onUpdate={(updates) => handleItemUpdate(item.id, updates)}
                />
              ))}
            </div>

            {/* Upload */}
            {user && (
              <ItemUpload
                userId={user.id}
                onUploadComplete={(url, path) => handleItemUploaded(category.id, url, path)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Add category */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCategory(); } }}
            placeholder="Add a new category (e.g., Bag, Belt, Hat)..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            onClick={addCategory}
            disabled={addingCategory || !newCategoryName.trim()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {addingCategory ? '...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
