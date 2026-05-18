import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { AppLayout } from '@/components/layouts/app-layout/AppLayout';
import { AuthProvider } from '@/components/auth-provider/AuthProvider';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/components/theme-provider';
import { getMessages } from 'next-intl/server';
import { concurrent } from '@/utils/concurrent.util';
import { getAuthInfo } from '@/utils/get-auth-info.util';
import { routing } from '@/i18n/routing';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Portfolio CMS',
  description: 'Portfolio management system',
};

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
  const { locale } = await params;
  const [messages, auth] = await concurrent([getMessages, getAuthInfo]);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <AuthProvider auth={auth}>
            <NextIntlClientProvider messages={messages}>
              <AppLayout>{children}</AppLayout>
            </NextIntlClientProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
