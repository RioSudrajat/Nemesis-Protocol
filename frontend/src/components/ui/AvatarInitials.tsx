import React from 'react';

const COLORS = [
  'bg-teal-500',
  'bg-emerald-500',
  'bg-cyan-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-rose-500',
  'bg-orange-500',
  'bg-amber-500',
];

interface AvatarInitialsProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AvatarInitials({ name, size = 'md', className = '' }: AvatarInitialsProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || '?';

  // Deterministic color based on name string
  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % COLORS.length;
  const bgColor = COLORS[colorIndex];

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  return (
    <div 
      className={`flex items-center justify-center shrink-0 rounded-full text-white font-bold ${bgColor} ${sizeClasses[size]} ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
}
