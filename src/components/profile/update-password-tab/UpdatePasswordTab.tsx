'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { notify } from '@/components/layouts/app-layout/notify-provider/NotifyProvider';
import { authRequest } from '@/requests/auth.request';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { InputPassword } from '@/components/input/input-password/InputPassword';
import { isStrongPassword } from '@/utils/form.util';

type UpdatePasswordValues = {
  password: string;
  newPassword: string;
  confirmPassword: string;
};

export function UpdatePasswordTab() {
  const t = useTranslations();
  const [saving, setSaving] = useState(false);

  const updatePasswordSchema = useMemo(
    () =>
      z
        .object({
          password: z.string().min(1, t('profile.validation.old_password_required')),
          newPassword: z
            .string()
            .min(8, t('profile.validation.password_min_length'))
            .refine(isStrongPassword, t('profile.validation.password_strength')),
          confirmPassword: z.string().min(1, t('profile.validation.confirm_password_required')),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
          path: ['confirmPassword'],
          message: t('profile.validation.confirm_password_mismatch'),
        }),
    [t],
  );

  const form = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: UpdatePasswordValues) => {
    setSaving(true);
    try {
      await authRequest.updatePassword({ password: values.password, newPassword: values.newPassword });
      notify.success(t('profile.messages.password_updated'));
      form.reset();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('profile.tabs.security')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profile.security.old_password')}</FormLabel>
                  <FormControl>
                    <InputPassword
                      {...field}
                      type="password"
                      placeholder={t('profile.security.old_password_placeholder')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profile.security.new_password')}</FormLabel>
                  <FormControl>
                    <InputPassword
                      {...field}
                      type="password"
                      placeholder={t('profile.security.new_password_placeholder')}
                    />
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
                  <FormLabel>{t('profile.security.confirm_password')}</FormLabel>
                  <FormControl>
                    <InputPassword
                      {...field}
                      type="password"
                      placeholder={t('profile.security.confirm_password_placeholder')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={saving}>
              {saving ? t('common.saving') : t('common.save')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
