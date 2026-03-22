'use client';

import { Avatar, getSlotPosition } from '@/lib/avatars';
import { Item, Category } from '@/lib/types';

interface AvatarOutfitProps {
  avatar: Avatar;
  items: { item: Item; category: Category }[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarOutfit({ avatar, items, size = 'md', className = '' }: AvatarOutfitProps) {
  const dimensions = {
    sm: { width: 140, height: 350 },
    md: { width: 200, height: 500 },
    lg: { width: 260, height: 650 },
  };

  const { width, height } = dimensions[size];

  return (
    <div
      className={`relative ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Avatar silhouette (background) */}
      <img
        src={avatar.svg}
        alt={avatar.name}
        className="absolute inset-0 w-full h-full opacity-20"
        style={{ objectFit: 'contain' }}
      />

      {/* Clothing items overlaid at their slot positions */}
      {items.map(({ item, category }) => {
        const pos = getSlotPosition(category.name);
        return (
          <div
            key={item.id}
            className="absolute overflow-hidden flex items-center justify-center"
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.width,
              height: pos.height,
            }}
          >
            <img
              src={item.image_url}
              alt={item.name || category.name}
              className="max-w-full max-h-full object-contain drop-shadow-sm"
            />
          </div>
        );
      })}
    </div>
  );
}

// Simple avatar picker component
interface AvatarPickerProps {
  avatars: Avatar[];
  selected: Avatar | null;
  onSelect: (avatar: Avatar) => void;
}

export function AvatarPicker({ avatars, selected, onSelect }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {avatars.map(avatar => (
        <button
          key={avatar.id}
          onClick={() => onSelect(avatar)}
          className={`rounded-xl border-2 p-2 transition-all ${
            selected?.id === avatar.id
              ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="aspect-[2/5] flex items-center justify-center">
            <img
              src={avatar.svg}
              alt={avatar.name}
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-xs text-center font-medium text-gray-700 mt-1">{avatar.name}</p>
          <p className="text-[10px] text-center text-gray-400">{avatar.description}</p>
        </button>
      ))}
    </div>
  );
}
