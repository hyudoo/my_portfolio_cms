'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SettingEntity } from '@/types/entities/setting.entity';
import { UpdateSettingBody } from '@/types/requests/setting.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const urlOrEmpty = z.string().max(500).nullable();

const schema = z.object({
  github: urlOrEmpty,
  linkedin: urlOrEmpty,
  twitter: urlOrEmpty,
  facebook: urlOrEmpty,
  instagram: urlOrEmpty,
  youtube: urlOrEmpty,
  resumeUrl: urlOrEmpty,
});

type FormValues = z.infer<typeof schema>;

type Props = {
  setting: SettingEntity;
  onSave: (body: UpdateSettingBody) => Promise<void>;
  saving: boolean;
};

const SOCIAL_FIELDS = [
  'github',
  'linkedin',
  'twitter',
  'facebook',
  'instagram',
  'youtube',
  'resumeUrl',
] as const;

export function SocialLinksTab({ setting, onSave, saving }: Props) {
  const t = useTranslations();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      github: setting.github,
      linkedin: setting.linkedin,
      twitter: setting.twitter,
      facebook: setting.facebook,
      instagram: setting.instagram,
      youtube: setting.youtube,
      resumeUrl: setting.resumeUrl,
    },
  });

  useEffect(() => {
    form.reset({
      github: setting.github,
      linkedin: setting.linkedin,
      twitter: setting.twitter,
      facebook: setting.facebook,
      instagram: setting.instagram,
      youtube: setting.youtube,
      resumeUrl: setting.resumeUrl,
    });
  }, [setting, form]);

  const handleSubmit = (values: FormValues) => {
    const body: UpdateSettingBody = {};
    for (const key of SOCIAL_FIELDS) {
      body[key] = values[key] || null;
    }
    return onSave(body);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('settings.tabs.social')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-w-xl">
            {SOCIAL_FIELDS.map((fieldName) => {
              const labelKey = fieldName === 'resumeUrl' ? 'resume_url' : fieldName;
              return (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t(`settings.social.${labelKey}`)}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value || null)}
                          placeholder={t(`settings.social.${labelKey}_placeholder`)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}

            <Button type="submit" disabled={saving}>
              {saving ? t('common.saving') : t('common.save')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
