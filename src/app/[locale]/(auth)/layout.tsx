import { LanguageToggle } from '@/components/dashboard/header/language-toggle/LanguageToggle';
import { ThemeToggle } from '@/components/dashboard/header/theme-toggle/ThemeToggle';
import { getTranslations } from 'next-intl/server';
import { AuthBrandPanel } from '../../../components/auth/auth-brand-panel/AuthBrandPanel';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const t = await getTranslations('auth.brand');
  return (
    <div className="min-h-screen flex">
      <AuthBrandPanel />
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          {/* Mobile-only logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold text-lg">
              P
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white leading-tight">{t('app_name')}</div>
              <div className="text-neutral-400 text-xs">{t('cms_admin')}</div>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
