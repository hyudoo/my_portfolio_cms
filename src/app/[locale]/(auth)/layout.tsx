import { AuthBrandPanel } from '../../../components/auth/auth-brand-panel/AuthBrandPanel';
import { LanguageToggle } from '@/components/dashboard/header/language-toggle/LanguageToggle';
import { ThemeToggle } from '@/components/dashboard/header/theme-toggle/ThemeToggle';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <div className="min-h-screen flex">
      <AuthBrandPanel />
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        {children}
      </div>
    </div>
  );
}
