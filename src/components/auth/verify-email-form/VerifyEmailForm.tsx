'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { authRequest } from '@/requests/auth.request';

type State = 'verifying' | 'success' | 'error';

type Props = {
  token: string;
};

export function VerifyEmailForm({ token }: Props) {
  const t = useTranslations();
  const [state, setState] = useState<State>('verifying');

  useEffect(() => {
    authRequest
      .verifyEmail({ token })
      .then(() => setState('success'))
      .catch(() => setState('error'));
  }, [token]);

  return (
    <AnimatePresence mode="wait">
      {state === 'verifying' && (
        <motion.div
          key="verifying"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center text-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground">{t('auth.verify_email.verifying')}</p>
        </motion.div>
      )}

      {state === 'success' && (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-sky-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('auth.verify_email.success_title')}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t('auth.verify_email.success_subtitle')}</p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-500 hover:text-sky-400 transition-colors mt-2"
          >
            {t('auth.verify_email.success_back')}
          </Link>
        </motion.div>
      )}

      {state === 'error' && (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('auth.verify_email.error_title')}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t('auth.verify_email.error_subtitle')}</p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-500 hover:text-sky-400 transition-colors mt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('auth.verify_email.back_to_login')}
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

