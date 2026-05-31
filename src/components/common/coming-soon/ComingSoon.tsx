import { Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ComingSoon() {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
        <Clock className="w-8 h-8 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-2xl font-semibold">{t('common.coming_soon')}</h2>
        <p className="text-muted-foreground mt-1">{t('common.coming_soon_desc')}</p>
      </div>
    </div>
  );
}
