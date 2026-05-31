'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { LUCIDE_ICON_REGISTRY } from '@/constants/lucide-icons';

type IconRendererProps = {
  icon: string | null | undefined;
  size?: number;
  className?: string;
  fallback?: React.ReactNode;
};

export const IconRenderer: React.FC<IconRendererProps> = ({
  icon,
  size = 20,
  className,
  fallback = null,
}) => {
  const [hasError, setHasError] = useState(false);
  const normalized = icon?.trim() ?? '';

  useEffect(() => {
    setHasError(false);
  }, [normalized]);

  if (!normalized) return <>{fallback}</>;

  const LucideIcon = LUCIDE_ICON_REGISTRY[normalized];
  if (LucideIcon) {
    return <LucideIcon width={size} height={size} className={cn('inline-block', className)} />;
  }

  if (hasError) return <>{fallback}</>;

  const src = normalized.startsWith('http://') || normalized.startsWith('https://')
    ? normalized
    : `https://cdn.simpleicons.org/${encodeURIComponent(normalized)}`;

  return (
    <img
      src={src}
      alt={normalized}
      width={size}
      height={size}
      className={cn('inline-block object-contain', className)}
      onError={() => setHasError(true)}
    />
  );
};
