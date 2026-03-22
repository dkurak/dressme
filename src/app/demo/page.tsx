'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DEMO_BOARDS, DemoBoard } from '@/lib/demoData';
import { Item } from '@/lib/types';
import { formatPrice } from '@/lib/constants';
import { generateOutfits, countCombinations, GeneratedOutfit } from '@/lib/outfits';

export default function DemoPage() {
  const [selectedBoard, setSelectedBoard] = useState<DemoBoard | null>(null);

  if (!selectedBoard) {
    return <DemoPicker onSelect={setSelectedBoard} />;
  }

  return <DemoWorkspace demo={selectedBoard} onBack={() => setSelectedBoard(null)} />;
}

// ============================================================
// Board picker
// ============================================================
function DemoPicker({ onSelect }: { onSelect: (d: DemoBoard) => void }) {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Try DressMe</h1>
        <p className="text-gray-600">Pick a sample board to see how it works. No account needed.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {DEMO_BOARDS.map(demo => (
          <button
            key={demo.board.id}
            onClick={() => onSelect(demo)}
            className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:shadow-md hover:border-gray-300 transition-all"
          >
            <h3 className="font-semibold text-gray-900 mb-1">{demo.board.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{demo.board.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {demo.categories.map(cat => (
                <span key={cat.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {cat.name} ({demo.items.filter(i => i.category_id === cat.id).length})
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              {demo.items.length} items &middot; Click to explore
            </p>
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-gray-500 mt-8">
        Ready to build your own?{' '}
        <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
          Create a free account
        </Link>
      </p>
    </div>
  );
}

// ============================================================
// Interactive demo workspace
// ============================================================
type DemoView = 'board' | 'outfits' | 'tournament';

function DemoWorkspace({ demo, onBack }: { demo: DemoBoard; onBack: () => void }) {
  const [view, setView] = useState<DemoView>('board');
  const [lockedItems, setLockedItems] = useState<Record<string, string>>({});
  const [outfits, setOutfits] = useState<GeneratedOutfit[]>([]);
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);

  // Tournament state
  const [tournamentOutfits, setTournamentOutfits] = useState<GeneratedOutfit[]>([]);
  const [matchQueue, setMatchQueue] = useState<[number, number][]>([]);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [champion, setChampion] = useState<GeneratedOutfit | null>(null);
  const [roundLabel, setRoundLabel] = useState('Round 1');

  const itemsByCategory: Record<string, Item[]> = {};
  for (const item of demo.items) {
    if (!itemsByCategory[item.category_id]) itemsByCategory[item.category_id] = [];
    itemsByCategory[item.category_id].push(item);
  }

  const itemMap: Record<string, Item> = {};
  for (const item of demo.items) {
    itemMap[item.id] = item;
  }

  const categoryMap: Record<string, string> = {};
  for (const cat of demo.categories) {
    categoryMap[cat.id] = cat.name;
  }

  const comboCount = countCombinations(demo.categories, itemsByCategory, lockedItems);

  const toggleLock = (categoryId: string, itemId: string) => {
    setLockedItems(prev => {
      const next = { ...prev };
      if (next[categoryId] === itemId) {
        delete next[categoryId];
      } else {
        next[categoryId] = itemId;
      }
      return next;
    });
  };

  const handleGenerate = () => {
    const generated = generateOutfits({ categories: demo.categories, itemsByCategory, lockedItems });
    setOutfits(generated);
    setCurrentOutfitIndex(0);
    setView('outfits');
  };

  const startTournament = () => {
    if (outfits.length < 2) return;

    // Shuffle outfits
    const shuffled = [...outfits].sort(() => Math.random() - 0.5);
    setTournamentOutfits(shuffled);

    // Create matchup pairs
    const pairs: [number, number][] = [];
    for (let i = 0; i < shuffled.length - 1; i += 2) {
      pairs.push([i, i + 1]);
    }
    setMatchQueue(pairs);
    setCurrentMatch(0);
    setChampion(null);
    setRoundLabel('Round 1');
    setView('tournament');
  };

  const pickTournamentWinner = (winnerIndex: number) => {
    const winners: number[] = [];

    // Collect all winners so far in this round
    for (let i = 0; i < currentMatch; i++) {
      // Previous winners already processed
    }

    // Process current match
    const newQueue = [...matchQueue];
    // Mark winner by replacing pair with single-element "pair"
    newQueue[currentMatch] = [winnerIndex, winnerIndex];

    if (currentMatch + 1 < matchQueue.length) {
      // More matches in this round
      setMatchQueue(newQueue);
      setCurrentMatch(currentMatch + 1);
    } else {
      // Round complete — collect winners and create next round
      const roundWinners: GeneratedOutfit[] = [];
      for (const [a, b] of newQueue) {
        // If a === b, it means this index won
        roundWinners.push(tournamentOutfits[a === b ? a : a]);
      }

      // Also handle any "bye" (odd outfit out)
      if (tournamentOutfits.length % 2 !== 0 && matchQueue.length * 2 < tournamentOutfits.length) {
        roundWinners.push(tournamentOutfits[tournamentOutfits.length - 1]);
      }

      if (roundWinners.length === 1) {
        // We have a champion!
        setChampion(roundWinners[0]);
      } else {
        // Start next round with winners
        setTournamentOutfits(roundWinners);
        const nextPairs: [number, number][] = [];
        for (let i = 0; i < roundWinners.length - 1; i += 2) {
          nextPairs.push([i, i + 1]);
        }
        setMatchQueue(nextPairs);
        setCurrentMatch(0);
        setRoundLabel(prev => {
          const num = parseInt(prev.split(' ')[1]) || 1;
          return `Round ${num + 1}`;
        });
      }
    }
  };

  const calcOutfitPrice = (outfit: GeneratedOutfit): number => {
    return Object.values(outfit.items).reduce((sum, itemId) => sum + (itemMap[itemId]?.price || 0), 0);
  };

  const renderOutfitStack = (outfit: GeneratedOutfit, size: 'sm' | 'lg' = 'lg') => {
    const imgSize = size === 'lg' ? 'w-20 h-20' : 'w-14 h-14';
    return (
      <div className="space-y-2">
        {demo.categories.map(cat => {
          const item = itemMap[outfit.items[cat.id]];
          if (!item) return null;
          return (
            <div key={cat.id} className="flex items-center gap-3">
              <div className={`${imgSize} bg-gray-50 rounded-lg overflow-hidden flex-shrink-0`}>
                <img src={item.image_url} alt={item.name || ''} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400">{cat.name}</p>
                <p className={`${size === 'lg' ? 'text-sm' : 'text-xs'} font-medium text-gray-900 truncate`}>{item.name}</p>
                {size === 'lg' && item.price && (
                  <p className="text-xs text-gray-500">{formatPrice(item.price)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ============================================================
  // BOARD VIEW
  // ============================================================
  if (view === 'board') {
    return (
      <div>
        <div className="flex items-start justify-between mb-6">
          <div>
            <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 mb-1">&larr; All Demos</button>
            <h1 className="text-2xl font-bold text-gray-900">{demo.board.title}</h1>
            <p className="text-gray-600 mt-1">{demo.board.description}</p>
            <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Demo Mode</span>
          </div>
        </div>

        {/* Generate bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {comboCount > 0 ? `${comboCount} outfit combination${comboCount !== 1 ? 's' : ''}` : 'Add items to generate outfits'}
            </p>
            <p className="text-xs text-gray-500">
              Tap items to lock your picks. Unlocked slots get mixed & matched.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={comboCount === 0}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Generate Outfits
          </button>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {demo.categories.map(category => (
            <div key={category.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900">{category.name}</h2>
                <span className="text-xs text-gray-400">
                  {(itemsByCategory[category.id] || []).length} items
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {(itemsByCategory[category.id] || []).map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggleLock(category.id, item.id)}
                    className={`relative rounded-lg border-2 overflow-hidden transition-all text-left ${
                      lockedItems[category.id] === item.id
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
                      <img src={item.image_url} alt={item.name || ''} className="w-full h-full object-contain p-1" />
                    </div>
                    {lockedItems[category.id] === item.id && (
                      <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
                        L
                      </div>
                    )}
                    <div className="px-2 py-1.5 bg-gray-50 border-t border-gray-100">
                      <p className="text-xs text-gray-700 truncate font-medium">{item.name}</p>
                      <div className="flex items-center justify-between mt-0.5">
                        {item.price && <span className="text-[10px] text-gray-500">{formatPrice(item.price)}</span>}
                        <span className={`text-[10px] px-1 py-0.5 rounded-full ${
                          item.is_owned ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {item.is_owned ? 'Owned' : 'To Buy'}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ============================================================
  // OUTFITS CAROUSEL VIEW
  // ============================================================
  if (view === 'outfits') {
    const current = outfits[currentOutfitIndex];

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <button onClick={() => setView('board')} className="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Board</button>
            <h1 className="text-xl font-bold text-gray-900">{demo.board.title} - Outfits</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{currentOutfitIndex + 1} of {outfits.length}</span>
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

        <div className="max-w-sm mx-auto">
          {/* Navigation */}
          <div className="relative">
            {currentOutfitIndex > 0 && (
              <button
                onClick={() => setCurrentOutfitIndex(i => i - 1)}
                className="absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50"
              >
                &larr;
              </button>
            )}
            {currentOutfitIndex < outfits.length - 1 && (
              <button
                onClick={() => setCurrentOutfitIndex(i => i + 1)}
                className="absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50"
              >
                &rarr;
              </button>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Outfit {currentOutfitIndex + 1}</span>
                {calcOutfitPrice(current) > 0 && (
                  <span className="text-xs text-gray-400">Total: {formatPrice(calcOutfitPrice(current))}</span>
                )}
              </div>
              <div className="p-4">
                {renderOutfitStack(current)}
              </div>
            </div>
          </div>

          {/* Dots */}
          {outfits.length <= 20 && (
            <div className="flex justify-center gap-1.5 mt-4">
              {outfits.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentOutfitIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentOutfitIndex ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // TOURNAMENT VIEW
  // ============================================================
  if (view === 'tournament') {
    if (champion) {
      return (
        <div className="max-w-sm mx-auto text-center">
          <button onClick={() => setView('outfits')} className="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Outfits</button>
          <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Champion!</h1>
          <p className="text-gray-500 mb-6">Your winning look for {demo.board.title}</p>

          <div className="bg-white rounded-xl border-2 border-amber-400 overflow-hidden shadow-lg p-4">
            {renderOutfitStack(champion)}
            {calcOutfitPrice(champion) > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-right">
                <span className="text-sm font-medium text-gray-700">Total: {formatPrice(calcOutfitPrice(champion))}</span>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={startTournament}
              className="w-full px-4 py-2 text-sm bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Run Again
            </button>
            <Link
              href="/signup"
              className="block w-full px-4 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
            >
              Create Your Own Board
            </Link>
          </div>
        </div>
      );
    }

    if (currentMatch >= matchQueue.length) {
      return <div className="text-center text-gray-500">Processing...</div>;
    }

    const [indexA, indexB] = matchQueue[currentMatch];
    const outfitA = tournamentOutfits[indexA];
    const outfitB = tournamentOutfits[indexB];

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <button onClick={() => setView('outfits')} className="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Outfits</button>
            <h1 className="text-xl font-bold text-gray-900">Tournament</h1>
          </div>
          <span className="text-sm text-gray-500">
            {roundLabel} &middot; Match {currentMatch + 1} of {matchQueue.length}
          </span>
        </div>

        <p className="text-center text-gray-600 mb-6">Which outfit do you prefer?</p>

        <div className="grid grid-cols-2 gap-4">
          {[
            { outfit: outfitA, index: indexA },
            { outfit: outfitB, index: indexB },
          ].map(({ outfit, index }) => (
            <button
              key={index}
              onClick={() => pickTournamentWinner(index)}
              className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-md transition-all text-left"
            >
              <div className="p-3">
                {renderOutfitStack(outfit, 'sm')}
              </div>
              {calcOutfitPrice(outfit) > 0 && (
                <div className="px-3 py-1.5 border-t border-gray-100">
                  <span className="text-xs text-gray-500">{formatPrice(calcOutfitPrice(outfit))}</span>
                </div>
              )}
              <div className="p-3 bg-gray-50 text-center">
                <span className="text-sm font-medium text-gray-700">Pick This One</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
