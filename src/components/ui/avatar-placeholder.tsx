import React from 'react';

interface AvatarPlaceholderProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-20 h-20 text-2xl',
};

export function AvatarPlaceholder({ name, size = 'md', className = '' }: AvatarPlaceholderProps) {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold ${sizeClasses[size]} ${className}`}
    >
      {initials}
    </div>
  );
}
