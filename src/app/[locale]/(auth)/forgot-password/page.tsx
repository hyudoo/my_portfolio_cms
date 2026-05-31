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
  return (
    <>
      <ForgotPasswordHeading />
      <ForgotPasswordForm />
    </>
  );
}
