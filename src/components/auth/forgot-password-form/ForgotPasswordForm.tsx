'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, MailCheck } from 'lucide-react';
import { Link } from '@/i18n/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

type ForgotPasswordFormValues = {
  email: string;
};

export function ForgotPasswordForm() {
  const t = useTranslations('auth');
  const [sentEmail, setSentEmail] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, t('validation.email_required'))
          .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), t('validation.email_invalid')),
      }),
    [t],
  );

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    // TODO: wire up actual API call
    await new Promise((r) => setTimeout(r, 800));
    setSentEmail(values.email);
  };

  return (
    <AnimatePresence mode="wait">
      {sentEmail ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
            <MailCheck className="w-8 h-8 text-sky-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('forgot_password.success_title')}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t('forgot_password.success_subtitle', { email: sentEmail })}
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-500 hover:text-sky-400 transition-colors mt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('forgot_password.success_back')}
          </Link>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">{t('email')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder={t('email_placeholder')}
                          className="h-11 pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-11 font-semibold" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                {t('forgot_password.submit')}
              </Button>
            </form>
          </Form>

          <Link
            href="/login"
            className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('forgot_password.back_to_login')}
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
