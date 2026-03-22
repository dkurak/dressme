export interface MatchupSeed {
  round: number;
  match_index: number;
  outfit_a_id: string;
  outfit_b_id: string;
}

// Shuffle array using Fisher-Yates
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function seedBracket(outfitIds: string[]): MatchupSeed[] {
  if (outfitIds.length < 2) return [];

  const shuffled = shuffle(outfitIds);
  const matchups: MatchupSeed[] = [];

  // Create round 1 matchups
  for (let i = 0; i < shuffled.length - 1; i += 2) {
    matchups.push({
      round: 1,
      match_index: Math.floor(i / 2),
      outfit_a_id: shuffled[i],
      outfit_b_id: shuffled[i + 1],
    });
  }

  // If odd number, the last outfit gets a bye (auto-advances)
  // We handle this by not creating a matchup for it — the tournament logic
  // will detect the missing matchup and auto-advance

  return matchups;
}

export function createNextRound(
  winnerIds: string[],
  currentRound: number
): MatchupSeed[] {
  if (winnerIds.length < 2) return [];

  const matchups: MatchupSeed[] = [];
  for (let i = 0; i < winnerIds.length - 1; i += 2) {
    matchups.push({
      round: currentRound + 1,
      match_index: Math.floor(i / 2),
      outfit_a_id: winnerIds[i],
      outfit_b_id: winnerIds[i + 1],
    });
  }

  return matchups;
}
