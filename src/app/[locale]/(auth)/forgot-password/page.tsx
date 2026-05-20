'use client';

import { useTranslations } from 'next-intl';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form/ForgotPasswordForm';

function ForgotPasswordHeading() {
  const t = useTranslations();
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1.5">{t('auth.forgot_password.title')}</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm">{t('auth.forgot_password.subtitle')}</p>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const t = useTranslations();
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

      <ForgotPasswordHeading />
      <ForgotPasswordForm />
    </div>
  );
}
