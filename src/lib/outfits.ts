import { Item, Category } from './types';

interface GenerationInput {
  categories: Category[];
  itemsByCategory: Record<string, Item[]>;
  lockedItems: Record<string, string>; // categoryId -> itemId
}

export interface GeneratedOutfit {
  items: Record<string, string>; // categoryId -> itemId
}

export function countCombinations(
  categories: Category[],
  itemsByCategory: Record<string, Item[]>,
  lockedItems: Record<string, string>
): number {
  let count = 1;
  for (const cat of categories) {
    if (lockedItems[cat.id]) continue;
    const items = itemsByCategory[cat.id] || [];
    if (items.length === 0) return 0;
    count *= items.length;
  }
  return count;
}

export function generateOutfits(
  input: GenerationInput,
  maxOutfits = 100
): GeneratedOutfit[] {
  const { categories, itemsByCategory, lockedItems } = input;

  // Separate locked and unlocked categories
  const unlockedCategories = categories.filter(c => !lockedItems[c.id]);

  // Build arrays of item IDs for each unlocked category
  const unlockedItemArrays: { categoryId: string; itemIds: string[] }[] = [];
  for (const cat of unlockedCategories) {
    const items = itemsByCategory[cat.id] || [];
    if (items.length === 0) return []; // Can't generate if a category has no items
    unlockedItemArrays.push({ categoryId: cat.id, itemIds: items.map(i => i.id) });
  }

  // If everything is locked, return a single outfit
  if (unlockedItemArrays.length === 0) {
    return [{ items: { ...lockedItems } }];
  }

  // Compute cartesian product
  const results: GeneratedOutfit[] = [];
  const indices = new Array(unlockedItemArrays.length).fill(0);

  while (results.length < maxOutfits) {
    // Build current combination
    const outfit: Record<string, string> = { ...lockedItems };
    for (let i = 0; i < unlockedItemArrays.length; i++) {
      outfit[unlockedItemArrays[i].categoryId] = unlockedItemArrays[i].itemIds[indices[i]];
    }
    results.push({ items: outfit });

    // Increment indices (odometer-style)
    let carry = true;
    for (let i = unlockedItemArrays.length - 1; i >= 0 && carry; i--) {
      indices[i]++;
      if (indices[i] >= unlockedItemArrays[i].itemIds.length) {
        indices[i] = 0;
      } else {
        carry = false;
      }
    }

    // If we've wrapped all the way around, we've generated everything
    if (carry) break;
  }

  return results;
}
