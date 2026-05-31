'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SettingEntity } from '@/types/entities/setting.entity';
import { UpdateSettingBody } from '@/types/requests/setting.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  ownerName: z.string().max(255),
  tagline: z.string().max(255),
  bio: z.string(),
  email: z.string().max(255),
  location: z.string().max(255),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  setting: SettingEntity;
  onSave: (body: UpdateSettingBody) => Promise<void>;
  saving: boolean;
};

export function GeneralSettingsTab({ setting, onSave, saving }: Props) {
  const t = useTranslations();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ownerName: setting.ownerName,
      tagline: setting.tagline,
      bio: setting.bio,
      email: setting.email,
      location: setting.location,
    },
  });

  useEffect(() => {
    form.reset({
      ownerName: setting.ownerName,
      tagline: setting.tagline,
      bio: setting.bio,
      email: setting.email,
      location: setting.location,
    });
  }, [setting, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('settings.tabs.general')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-4 max-w-xl">
            <FormField
              control={form.control}
              name="ownerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.general.owner_name')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('settings.general.owner_name_placeholder')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.general.tagline')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('settings.general.tagline_placeholder')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.general.bio')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder={t('settings.general.bio_placeholder')} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.general.email')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder={t('settings.general.email_placeholder')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.general.location')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('settings.general.location_placeholder')} />
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
