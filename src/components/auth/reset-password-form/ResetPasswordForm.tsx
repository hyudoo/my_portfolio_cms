'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, ArrowLeft, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { Link } from '@/i18n/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { authRequest } from '@/requests/auth.request';
import { notify } from '../../providers/notify-provider/NotifyProvider';

type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

type Props = {
  token: string;
};

export function ResetPasswordForm({ token }: Props) {
  const t = useTranslations('auth');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const schema = useMemo(
    () =>
      z
        .object({
          password: z.string().min(8, t('validation.password_min_length')),
          confirmPassword: z.string().min(1, t('validation.confirm_password_required')),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t('validation.confirm_password_mismatch'),
          path: ['confirmPassword'],
        }),
    [t],
  );

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await authRequest.resetPassword({ token, password: values.password });
      setSuccess(true);
    } catch {
      notify.error(t('reset_password.error'));
    }
  };

  return (
    <AnimatePresence mode="wait">
      {success ? (
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('reset_password.success_title')}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t('reset_password.success_subtitle')}</p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-500 hover:text-sky-400 transition-colors mt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('reset_password.success_back')}
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">{t('reset_password.new_password')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder={t('reset_password.new_password_placeholder')}
                          className="h-11 pl-9 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">{t('reset_password.confirm_password')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          type={showConfirm ? 'text' : 'password'}
                          placeholder={t('reset_password.confirm_password_placeholder')}
                          className="h-11 pl-9 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          tabIndex={-1}
                        >
                          {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
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
                {t('reset_password.submit')}
              </Button>
            </form>
          </Form>

          <Link
            href="/login"
            className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('reset_password.back_to_login')}
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
