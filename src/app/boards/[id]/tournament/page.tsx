'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Board, Tournament, TournamentMatchup, OutfitItem, Item, Category } from '@/lib/types';
import { formatPrice } from '@/lib/constants';
import { createNextRound } from '@/lib/tournament';

interface OutfitDisplay {
  id: string;
  items: (OutfitItem & { item: Item; category: Category })[];
  totalPrice: number;
}

export default function TournamentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const boardId = params.id as string;
  const tournamentId = searchParams.get('id');

  const [board, setBoard] = useState<Board | null>(null);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [matchups, setMatchups] = useState<TournamentMatchup[]>([]);
  const [currentMatchup, setCurrentMatchup] = useState<TournamentMatchup | null>(null);
  const [outfitA, setOutfitA] = useState<OutfitDisplay | null>(null);
  const [outfitB, setOutfitB] = useState<OutfitDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [picking, setPicking] = useState(false);
  const [winner, setWinner] = useState<OutfitDisplay | null>(null);

  const loadOutfit = async (outfitId: string): Promise<OutfitDisplay | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('outfit_items')
      .select('*, item:items(*), category:categories(*)')
      .eq('outfit_id', outfitId)
      .order('category_id');

    if (error || !data) return null;

    const items = (data as (OutfitItem & { item: Item; category: Category })[])
      .sort((a, b) => (a.category?.sort_order || 0) - (b.category?.sort_order || 0));

    return {
      id: outfitId,
      items,
      totalPrice: items.reduce((sum, oi) => sum + (oi.item?.price || 0), 0),
    };
  };

  const load = async () => {
    if (!supabase || !tournamentId) return;

    const [boardRes, tournRes, matchRes] = await Promise.all([
      supabase.from('boards').select('*').eq('id', boardId).single(),
      supabase.from('tournaments').select('*').eq('id', tournamentId).single(),
      supabase.from('tournament_matchups').select('*').eq('tournament_id', tournamentId)
        .order('round').order('match_index'),
    ]);

    setBoard(boardRes.data as Board);
    setTournament(tournRes.data as Tournament);
    const allMatchups = (matchRes.data || []) as TournamentMatchup[];
    setMatchups(allMatchups);

    // Find first undecided matchup
    const undecided = allMatchups.find(m => !m.winner_id);

    if (undecided) {
      setCurrentMatchup(undecided);
      const [a, b] = await Promise.all([
        loadOutfit(undecided.outfit_a_id),
        loadOutfit(undecided.outfit_b_id),
      ]);
      setOutfitA(a);
      setOutfitB(b);
    } else {
      // All matchups decided — check if we need another round
      const currentRound = tournRes.data?.current_round || 1;
      const roundMatchups = allMatchups.filter(m => m.round === currentRound);
      const winners = roundMatchups.map(m => m.winner_id!).filter(Boolean);

      if (winners.length === 1) {
        // We have a champion!
        const championOutfit = await loadOutfit(winners[0]);
        setWinner(championOutfit);
        if (supabase) {
          await supabase.from('tournaments')
            .update({ status: 'completed', winner_outfit_id: winners[0] })
            .eq('id', tournamentId);
          await supabase.from('outfits')
            .update({ is_winner: true })
            .eq('id', winners[0]);
        }
      } else if (winners.length > 1) {
        // Need next round
        const nextMatchups = createNextRound(winners, currentRound);
        if (nextMatchups.length > 0 && supabase) {
          await supabase.from('tournament_matchups').insert(
            nextMatchups.map(m => ({ ...m, tournament_id: tournamentId }))
          );
          await supabase.from('tournaments')
            .update({ current_round: currentRound + 1 })
            .eq('id', tournamentId);
          // Reload
          load();
          return;
        }
      }
    }

    setLoading(false);
  };

  useEffect(() => { load(); }, [tournamentId, boardId]);

  const pickWinner = async (winnerId: string) => {
    if (!supabase || !currentMatchup || picking) return;
    setPicking(true);

    await supabase.from('tournament_matchups')
      .update({ winner_id: winnerId })
      .eq('id', currentMatchup.id);

    // Reload to get next matchup
    setPicking(false);
    setLoading(true);
    load();
  };

  const currentRound = tournament?.current_round || 1;
  const totalInRound = matchups.filter(m => m.round === currentRound).length;
  const decidedInRound = matchups.filter(m => m.round === currentRound && m.winner_id).length;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Loading tournament...</p>
      </div>
    );
  }

  // Champion screen
  if (winner) {
    return (
      <div className="max-w-md mx-auto text-center">
        <Link href={`/boards/${boardId}`} className="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Board</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Champion!</h1>
        <p className="text-gray-500 mb-6">Your winning outfit for {board?.title}</p>

        <div className="bg-white rounded-xl border-2 border-amber-400 overflow-hidden shadow-lg">
          <div className="p-4 space-y-3">
            {winner.items.map(oi => (
              <div key={oi.id} className="flex items-center gap-3">
                <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={oi.item?.image_url} alt={oi.item?.name || ''} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs text-gray-400">{oi.category?.name}</p>
                  <p className="text-sm font-medium text-gray-900">{oi.item?.name || 'Untitled'}</p>
                  {oi.item?.brand && <p className="text-xs text-gray-500">{oi.item.brand}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    {oi.item?.price && <span className="text-xs text-gray-600">{formatPrice(oi.item.price)}</span>}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      oi.item?.is_owned ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {oi.item?.is_owned ? 'Owned' : 'To Buy'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {winner.totalPrice > 0 && (
            <div className="p-3 border-t border-gray-100 text-right">
              <span className="text-sm font-medium text-gray-700">Total: {formatPrice(winner.totalPrice)}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Matchup screen
  if (!currentMatchup || !outfitA || !outfitB) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-gray-500">No matchups available.</p>
        <Link href={`/boards/${boardId}/outfits`} className="text-blue-600 hover:text-blue-800 mt-2">
          Back to Outfits
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <Link href={`/boards/${boardId}/outfits`} className="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Outfits</Link>
          <h1 className="text-xl font-bold text-gray-900">Tournament</h1>
        </div>
        <span className="text-sm text-gray-500">
          Round {currentRound} &middot; Match {decidedInRound + 1} of {totalInRound}
        </span>
      </div>

      <p className="text-center text-gray-600 mb-6">Which outfit do you prefer?</p>

      <div className="grid grid-cols-2 gap-4">
        {[outfitA, outfitB].map((outfit) => (
          <button
            key={outfit.id}
            onClick={() => pickWinner(outfit.id)}
            disabled={picking}
            className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-md transition-all disabled:opacity-50 text-left"
          >
            <div className="p-3 space-y-2">
              {outfit.items.map(oi => (
                <div key={oi.id} className="flex items-center gap-2">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={oi.item?.image_url} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-400">{oi.category?.name}</p>
                    <p className="text-xs font-medium text-gray-900 truncate">{oi.item?.name || 'Untitled'}</p>
                  </div>
                </div>
              ))}
            </div>
            {outfit.totalPrice > 0 && (
              <div className="p-2 border-t border-gray-100 text-center">
                <span className="text-xs text-gray-500">{formatPrice(outfit.totalPrice)}</span>
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
