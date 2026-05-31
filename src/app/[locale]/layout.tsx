import { AppLayout } from '@/components/layouts/app-layout/AppLayout';
import { AuthProvider } from '@/components/providers/auth-provider/AuthProvider';
import { ThemeProvider } from '@/components/providers/theme-provider/ThemeProvider';
import { routing } from '@/i18n/routing';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const messages = await getMessages();

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
      <NextIntlClientProvider messages={messages}>
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
        </AuthProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
