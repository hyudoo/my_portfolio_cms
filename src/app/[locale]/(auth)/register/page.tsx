'use client';

import { useTranslations } from 'next-intl';
import { RegisterForm } from '@/components/auth/register-form/RegisterForm';

function RegisterHeading() {
  const t = useTranslations();
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1.5">{t('auth.register.title')}</h2>
      <p className="text-neutral-500 dark:text-neutral-400 text-sm">{t('auth.register.subtitle')}</p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <>
      <RegisterHeading />
      <RegisterForm />
    </>
  );
}
