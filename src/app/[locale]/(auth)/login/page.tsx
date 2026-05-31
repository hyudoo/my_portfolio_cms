'use client';

import { useTranslations } from 'next-intl';
import { LoginForm } from '@/components/auth/login-form/LoginForm';

function LoginHeading() {
  const t = useTranslations();
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1.5">{t('auth.login.title')}</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm">{t('auth.login.subtitle')}</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <LoginHeading />
      <LoginForm />
    </>
  );
}
