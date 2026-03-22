'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Board, Category, Item, Outfit, OutfitItem } from '@/lib/types';
import { formatPrice } from '@/lib/constants';

interface OutfitWithDetails extends Outfit {
  outfit_items: (OutfitItem & { item: Item; category: Category })[];
}

export default function OutfitsPage() {
  const router = useRouter();
  const params = useParams();
  const boardId = params.id as string;

  const [board, setBoard] = useState<Board | null>(null);
  const [outfits, setOutfits] = useState<OutfitWithDetails[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      if (!supabase) return;

      const [boardRes, catRes, outfitsRes] = await Promise.all([
        supabase.from('boards').select('*').eq('id', boardId).single(),
        supabase.from('categories').select('*').eq('board_id', boardId).order('sort_order'),
        supabase.from('outfits').select(`
          *,
          outfit_items (
            *,
            item:items (*),
            category:categories (*)
          )
        `).eq('board_id', boardId).order('created_at'),
      ]);

      setBoard(boardRes.data as Board);
      setCategories((catRes.data || []) as Category[]);

      // Sort outfit items by category sort_order
      const processedOutfits = ((outfitsRes.data || []) as OutfitWithDetails[]).map(outfit => ({
        ...outfit,
        outfit_items: outfit.outfit_items.sort(
          (a, b) => (a.category?.sort_order || 0) - (b.category?.sort_order || 0)
        ),
      }));

      setOutfits(processedOutfits);
      setLoading(false);
    }
    load();
  }, [boardId]);

  const scrollTo = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const child = container.children[index] as HTMLElement;
    if (child) {
      child.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setCurrentIndex(index);
    }
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.children[0]?.clientWidth || 1;
    const gap = 16;
    setCurrentIndex(Math.round(scrollLeft / (itemWidth + gap)));
  };

  const calcTotal = (outfit: OutfitWithDetails): number => {
    return outfit.outfit_items.reduce((sum, oi) => sum + (oi.item?.price || 0), 0);
  };

  const startTournament = async () => {
    if (!supabase || outfits.length < 2) return;

    // Create tournament
    const { data: tournament, error } = await supabase
      .from('tournaments')
      .insert({ board_id: boardId, name: `${board?.title} Tournament` })
      .select()
      .single();

    if (error || !tournament) { alert('Failed to create tournament'); return; }

    // Seed bracket
    const { seedBracket } = await import('@/lib/tournament');
    const matchups = seedBracket(outfits.map(o => o.id));

    if (matchups.length > 0) {
      await supabase.from('tournament_matchups').insert(
        matchups.map(m => ({ ...m, tournament_id: tournament.id }))
      );
    }

    router.push(`/boards/${boardId}/tournament?id=${tournament.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Loading outfits...</p>
      </div>
    );
  }

  if (outfits.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <p className="text-gray-500 mb-4">No outfits generated yet.</p>
        <Link
          href={`/boards/${boardId}`}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Go Back & Generate
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <Link href={`/boards/${boardId}`} className="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Board</Link>
          <h1 className="text-xl font-bold text-gray-900">{board?.title} - Outfits</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {currentIndex + 1} of {outfits.length}
          </span>
          {outfits.length >= 2 && (
            <button
              onClick={startTournament}
              className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Start Tournament
            </button>
          )}
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="relative">
        {currentIndex > 0 && (
          <button
            onClick={() => scrollTo(currentIndex - 1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50"
          >
            &larr;
          </button>
        )}
        {currentIndex < outfits.length - 1 && (
          <button
            onClick={() => scrollTo(currentIndex + 1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50"
          >
            &rarr;
          </button>
        )}

        {/* Carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="carousel-container flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {outfits.map((outfit, index) => (
            <div
              key={outfit.id}
              className="carousel-item flex-none w-[280px] sm:w-[320px] bg-white rounded-xl border border-gray-200 overflow-hidden snap-center"
            >
              <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Outfit {index + 1}</span>
                <span className="text-xs text-gray-400">
                  {calcTotal(outfit) > 0 && `Total: ${formatPrice(calcTotal(outfit))}`}
                </span>
              </div>
              <div className="p-3 space-y-3">
                {outfit.outfit_items.map(oi => (
                  <div key={oi.id} className="flex items-center gap-3">
                    <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={oi.item?.image_url}
                        alt={oi.item?.name || ''}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">{oi.category?.name}</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{oi.item?.name || 'Untitled'}</p>
                      {oi.item?.price && (
                        <p className="text-xs text-gray-500">{formatPrice(oi.item.price)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {outfits.length <= 20 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {outfits.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentIndex ? 'bg-gray-900' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
