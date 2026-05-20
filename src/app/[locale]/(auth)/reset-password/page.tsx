'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { ResetPasswordForm } from '@/components/auth/reset-password-form/ResetPasswordForm';
import { Link } from '@/i18n/navigation';

function ResetPasswordHeading() {
  const t = useTranslations('auth.reset_password');
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1.5">{t('title')}</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm">{t('subtitle')}</p>
    </div>
  );
}

function InvalidToken() {
  const t = useTranslations('auth');
  return (
    <div className="flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('reset_password.invalid_token')}
        </h3>
      </div>
      <Link
        href="/forgot-password"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-500 hover:text-sky-400 transition-colors mt-2"
      >
        {t('forgot_password.submit')}
      </Link>
    </div>
  );
}

export default function ResetPasswordPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div className="w-full max-w-md">
      {/* Mobile-only logo */}
      <div className="flex items-center gap-3 mb-10 lg:hidden">
        <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold text-lg">
          P
        </div>
        <div>
          <div className="font-bold text-gray-900 dark:text-white leading-tight">{t('auth.brand.app_name')}</div>
          <div className="text-neutral-400 text-xs">{t('auth.brand.cms_admin')}</div>
        </div>
      </div>

      {token ? (
        <>
          <ResetPasswordHeading />
          <ResetPasswordForm token={token} />
        </>
      ) : (
        <InvalidToken />
      )}
    </div>
  );
}
