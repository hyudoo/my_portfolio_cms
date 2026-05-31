'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, AtSign, MailCheck, ArrowLeft } from 'lucide-react';
import { Link, useRouter } from '@/i18n/navigation';
import { isStrongPassword } from '@/utils/form.util';
import { notify } from '@/components/layouts/app-layout/notify-provider/NotifyProvider';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputPassword } from '@/components/input/input-password/InputPassword';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

type RegisterFormValues = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function RegisterForm() {
  const t = useTranslations();
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [socialLoading, setSocialLoading] = useState<'github' | 'google' | null>(null);

  const registerSchema = useMemo(
    () =>
      z
        .object({
          name: z.string().min(1, t('auth.validation.name_required')),
          username: z.string().min(1, t('auth.validation.username_required')),
          email: z
            .string()
            .min(1, t('auth.validation.email_required'))
            .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), t('auth.validation.email_invalid')),
          password: z
            .string()
            .min(1, t('auth.validation.password_required'))
            .min(8, t('auth.validation.password_min_length'))
            .refine(isStrongPassword, t('auth.validation.password_strength')),
          confirmPassword: z.string().min(1, t('auth.validation.confirm_password_required')),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t('auth.validation.confirm_password_mismatch'),
          path: ['confirmPassword'],
        }),
    [t],
  );

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', username: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    const { confirmPassword: _, ...body } = values;
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      notify.error(t('auth.register.error'));
      return;
    }

    setRegisteredEmail(values.email);
  };

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    setSocialLoading(provider);
    // TODO: wire up OAuth provider
    setSocialLoading(null);
  };

  return (
    <AnimatePresence mode="wait">
      {registeredEmail ? (
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('auth.register.success_title')}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t('auth.register.success_subtitle', { email: registeredEmail })}
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-500 hover:text-sky-400 transition-colors mt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('auth.register.success_back')}
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
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">{t('auth.register.name')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input placeholder={t('auth.register.name_placeholder')} className="h-11 pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">{t('auth.register.username')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            placeholder={t('auth.register.username_placeholder')}
                            className="h-11 pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">{t('auth.email')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder={t('auth.email_placeholder')}
                          className="h-11 pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">{t('auth.password')}</FormLabel>
                    <FormControl>
                      <InputPassword placeholder={t('auth.password_placeholder')} className="h-11" {...field} />
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
                    <FormLabel className="text-sm font-medium">{t('auth.register.confirm_password')}</FormLabel>
                    <FormControl>
                      <InputPassword
                        placeholder={t('auth.register.confirm_password_placeholder')}
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-11 font-semibold" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                {t('auth.register.submit')}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t('auth.register.has_account')}{' '}
            <Link href="/login" className="font-semibold text-sky-500 hover:text-sky-400 transition-colors">
              {t('auth.register.link_login')}
            </Link>
          </p>

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              {t('auth.or_continue_with')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11"
              disabled={!!socialLoading}
              onClick={() => handleSocialLogin('github')}
            >
              {socialLoading === 'github' ? (
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <FaGithub className="size-4" />
              )}
              GitHub
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11"
              disabled={!!socialLoading}
              onClick={() => handleSocialLogin('google')}
            >
              {socialLoading === 'google' ? (
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <FaGoogle className="size-4" />
              )}
              Google
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
