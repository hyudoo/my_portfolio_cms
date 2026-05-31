'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { VerifyEmailForm } from '@/components/auth/verify-email-form/VerifyEmailForm';
import { Link } from '@/i18n/navigation';

function InvalidToken() {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('auth.verify_email.invalid_token')}</h3>
      </div>
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-500 hover:text-sky-400 transition-colors mt-2"
      >
        {t('auth.verify_email.back_to_login')}
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('auth.verify_email.token');

  return token ? <VerifyEmailForm token={token} /> : <InvalidToken />;
}
