import { Item, Category } from './types';

interface GenerationInput {
  categories: Category[];
  itemsByCategory: Record<string, Item[]>;
  selectedItems: Record<string, Set<string>>; // categoryId -> set of selected itemIds
}

export interface GeneratedOutfit {
  items: Record<string, string>; // categoryId -> itemId
}

// Get the effective items for a category: selected ones if any, otherwise all
function getEffectiveItems(
  categoryId: string,
  itemsByCategory: Record<string, Item[]>,
  selectedItems: Record<string, Set<string>>
): Item[] {
  const allItems = itemsByCategory[categoryId] || [];
  const selected = selectedItems[categoryId];
  if (selected && selected.size > 0) {
    return allItems.filter(i => selected.has(i.id));
  }
  return allItems; // No selection = use all
}

export function countCombinations(
  categories: Category[],
  itemsByCategory: Record<string, Item[]>,
  selectedItems: Record<string, Set<string>>
): number {
  let count = 1;
  for (const cat of categories) {
    const items = getEffectiveItems(cat.id, itemsByCategory, selectedItems);
    if (items.length === 0) return 0;
    count *= items.length;
  }
  return count;
}

export function generateOutfits(
  input: GenerationInput,
  maxOutfits = 100
): GeneratedOutfit[] {
  const { categories, itemsByCategory, selectedItems } = input;

  // Build arrays of item IDs for each category
  const categoryItemArrays: { categoryId: string; itemIds: string[] }[] = [];
  for (const cat of categories) {
    const items = getEffectiveItems(cat.id, itemsByCategory, selectedItems);
    if (items.length === 0) return [];
    categoryItemArrays.push({ categoryId: cat.id, itemIds: items.map(i => i.id) });
  }

  if (categoryItemArrays.length === 0) return [];

  // Compute cartesian product
  const results: GeneratedOutfit[] = [];
  const indices = new Array(categoryItemArrays.length).fill(0);

  while (results.length < maxOutfits) {
    const outfit: Record<string, string> = {};
    for (let i = 0; i < categoryItemArrays.length; i++) {
      outfit[categoryItemArrays[i].categoryId] = categoryItemArrays[i].itemIds[indices[i]];
    }
    results.push({ items: outfit });

    let carry = true;
    for (let i = categoryItemArrays.length - 1; i >= 0 && carry; i--) {
      indices[i]++;
      if (indices[i] >= categoryItemArrays[i].itemIds.length) {
        indices[i] = 0;
      } else {
        carry = false;
      }
    }

    if (carry) break;
  }

  return results;
}
