'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Link, useRouter } from '@/i18n/navigation';
import { notify } from '@/components/layouts/app-layout/notify-provider/NotifyProvider';
import { FaGithub, FaGoogle } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputPassword } from '@/components/input/input-password/InputPassword';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { authRequest } from '@/requests/auth.request';

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const [socialLoading, setSocialLoading] = useState<'github' | 'google' | null>(null);

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, t('auth.validation.email_required'))
          .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), t('auth.validation.email_invalid')),
        password: z.string().min(1, t('auth.validation.password_required')),
      }),
    [t],
  );

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    const res = await authRequest.login({ email: values.email, password: values.password });

    if (res?.error) {
      notify.error(t('auth.login.error'));
    } else {
      router.replace('/dashboard');
    }
  };

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    setSocialLoading(provider);
    // TODO: wire up OAuth provider
    setSocialLoading(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">{t('auth.email')}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input type="email" placeholder={t('auth.email_placeholder')} className="h-11 pl-9" {...field} />
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

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-sky-500 hover:text-sky-400 transition-colors"
            >
              {t('auth.login.forgot_password')}
            </Link>
          </div>

          <Button type="submit" className="w-full h-11 font-semibold" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {t('auth.login.submit')}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        {t('auth.login.no_account')}{' '}
        <Link href="/register" className="font-semibold text-sky-500 hover:text-sky-400 transition-colors">
          {t('auth.login.link_register')}
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
  );
}
