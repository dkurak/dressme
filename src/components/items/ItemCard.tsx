'use client';

import { useState } from 'react';
import { Item } from '@/lib/types';
import { formatPrice } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { deleteItemImage } from '@/lib/storage';

interface ItemCardProps {
  item: Item;
  isLocked: boolean;
  onToggleLock: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<Item>) => void;
}

export function ItemCard({ item, isLocked, onToggleLock, onDelete, onUpdate }: ItemCardProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name || '');
  const [brand, setBrand] = useState(item.brand || '');
  const [price, setPrice] = useState(item.price?.toString() || '');
  const [productUrl, setProductUrl] = useState(item.product_url || '');
  const [deleting, setDeleting] = useState(false);

  const handleSave = () => {
    onUpdate({
      name: name.trim() || null,
      brand: brand.trim() || null,
      price: price ? parseFloat(price) : null,
      product_url: productUrl.trim() || null,
    });
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this item?')) return;
    setDeleting(true);
    await deleteItemImage(item.image_path);
    if (supabase) {
      await supabase.from('items').delete().eq('id', item.id);
    }
    onDelete();
  };

  return (
    <div className={`relative group rounded-lg border-2 overflow-hidden transition-all ${
      isLocked ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
    }`}>
      {/* Image */}
      <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
        <img
          src={item.image_url}
          alt={item.name || 'Item'}
          className="w-full h-full object-contain p-1"
        />
      </div>

      {/* Lock button */}
      <button
        onClick={onToggleLock}
        className={`absolute top-1 left-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
          isLocked
            ? 'bg-blue-500 text-white'
            : 'bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100'
        }`}
        title={isLocked ? 'Unlock' : 'Lock this item'}
      >
        {isLocked ? 'L' : 'L'}
      </button>

      {/* Action buttons */}
      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setEditing(true)}
          className="w-7 h-7 rounded-full bg-white/80 text-gray-600 flex items-center justify-center text-xs hover:bg-white"
          title="Edit"
        >
          E
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-7 h-7 rounded-full bg-white/80 text-red-500 flex items-center justify-center text-xs hover:bg-white"
          title="Delete"
        >
          X
        </button>
      </div>

      {/* Info bar */}
      <div className="px-2 py-1.5 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-700 truncate font-medium">
            {item.name || 'Untitled'}
          </p>
          {item.price && (
            <span className="text-xs text-gray-500 ml-1 whitespace-nowrap">
              {formatPrice(item.price, item.currency)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          {item.brand && <span className="text-[10px] text-gray-400">{item.brand}</span>}
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            item.is_owned ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {item.is_owned ? 'Owned' : 'To Buy'}
          </span>
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditing(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-3" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-gray-900">Edit Item</h3>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Name" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="text" value={brand} onChange={e => setBrand(e.target.value)}
              placeholder="Brand" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="number" value={price} onChange={e => setPrice(e.target.value)}
              placeholder="Price" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="url" value={productUrl} onChange={e => setProductUrl(e.target.value)}
              placeholder="Product URL" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={item.is_owned}
                  onChange={(e) => onUpdate({ is_owned: e.target.checked })}
                  className="mr-1.5"
                />
                I own this
              </label>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={handleSave} className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Save
              </button>
              <button onClick={() => setEditing(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
