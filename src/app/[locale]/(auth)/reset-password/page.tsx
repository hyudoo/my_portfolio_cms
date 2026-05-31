'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { ResetPasswordForm } from '@/components/auth/reset-password-form/ResetPasswordForm';
import { Link } from '@/i18n/navigation';

function ResetPasswordHeading() {
  const t = useTranslations();
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1.5">{t('auth.reset_password.title')}</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm">{t('auth.reset_password.subtitle')}</p>
    </div>
  );
}

function InvalidToken() {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('auth.reset_password.invalid_token')}
        </h3>
      </div>
      <Link
        href="/forgot-password"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-500 hover:text-sky-400 transition-colors mt-2"
      >
        {t('auth.forgot_password.submit')}
      </Link>
    </div>
  );
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return token ? (
    <>
      <ResetPasswordHeading />
      <ResetPasswordForm token={token} />
    </>
  ) : (
    <InvalidToken />
  );
}
