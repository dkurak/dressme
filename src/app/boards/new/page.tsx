'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { CATEGORY_PRESETS } from '@/lib/types';

export default function NewBoardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && !user) {
    router.push('/login');
    return null;
  }

  const categories = selectedPreset && selectedPreset !== 'Custom'
    ? CATEGORY_PRESETS[selectedPreset]
    : customCategories;

  const addCategory = () => {
    const name = newCategory.trim();
    if (name && !customCategories.includes(name)) {
      setCustomCategories([...customCategories, name]);
      setNewCategory('');
    }
  };

  const removeCategory = (index: number) => {
    setCustomCategories(customCategories.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !user) return;
    if (!title.trim()) { setError('Title is required'); return; }
    if (categories.length === 0) { setError('Add at least one category'); return; }

    setIsSubmitting(true);
    setError(null);

    // Create board
    const { data: board, error: boardError } = await supabase
      .from('boards')
      .insert({ user_id: user.id, title: title.trim(), description: description.trim() || null })
      .select()
      .single();

    if (boardError || !board) {
      setError('Failed to create board');
      setIsSubmitting(false);
      return;
    }

    // Create categories
    const categoryRows = categories.map((name, index) => ({
      board_id: board.id,
      name,
      sort_order: index,
    }));

    const { error: catError } = await supabase
      .from('categories')
      .insert(categoryRows);

    if (catError) {
      console.error('Error creating categories:', catError);
    }

    router.push(`/boards/${board.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Board</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Board Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="e.g., Wedding in June, Ski Trip"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
              placeholder="What's this outfit for?"
            />
          </div>
        </div>

        {/* Category presets */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Outfit Slots
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Choose a preset or build your own. These are the categories you&apos;ll add items to.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(CATEGORY_PRESETS).map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setSelectedPreset(preset);
                  if (preset === 'Custom') setCustomCategories([]);
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedPreset === preset
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Show selected categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((cat, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {cat}
                  {selectedPreset === 'Custom' && (
                    <button
                      type="button"
                      onClick={() => removeCategory(i)}
                      className="text-blue-400 hover:text-blue-600 ml-0.5"
                    >
                      x
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}

          {/* Custom category input */}
          {selectedPreset === 'Custom' && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCategory(); } }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
                placeholder="Add a category..."
              />
              <button
                type="button"
                onClick={addCategory}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
              >
                Add
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !title.trim() || categories.length === 0}
          className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Creating...' : 'Create Board'}
        </button>
      </form>
    </div>
  );
}
