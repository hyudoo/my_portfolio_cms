'use client';

import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { Language } from '@/enums/language.enum';

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleToggle = () => {
    const next = locale === Language.En ? Language.Vi : Language.En;
    router.replace(pathname, { locale: next });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="h-9 w-9 relative"
      aria-label={locale === Language.En ? 'Switch to Vietnamese' : 'Switch to English'}
    >
      <Languages className="h-4 w-4" />
      <span className="absolute -bottom-0.5 -right-0.5 text-[10px] font-bold uppercase bg-primary text-primary-foreground rounded px-1">
        {locale === Language.En ? 'VI' : 'EN'}
      </span>
    </Button>
  );
}
