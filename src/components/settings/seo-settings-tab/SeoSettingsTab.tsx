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

const nullableStr = z.string().max(500).nullable();

const schema = z.object({
  seoTitle: z.string().max(255).nullable(),
  seoDescription: nullableStr,
  seoKeywords: z.string().max(500).nullable(),
  gaId: z.string().max(100).nullable(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  setting: SettingEntity;
  onSave: (body: UpdateSettingBody) => Promise<void>;
  saving: boolean;
};

export function SeoSettingsTab({ setting, onSave, saving }: Props) {
  const t = useTranslations();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      seoTitle: setting.seoTitle,
      seoDescription: setting.seoDescription,
      seoKeywords: setting.seoKeywords,
      gaId: setting.gaId,
    },
  });

  useEffect(() => {
    form.reset({
      seoTitle: setting.seoTitle,
      seoDescription: setting.seoDescription,
      seoKeywords: setting.seoKeywords,
      gaId: setting.gaId,
    });
  }, [setting, form]);

  const handleSubmit = (values: FormValues) =>
    onSave({
      seoTitle: values.seoTitle || null,
      seoDescription: values.seoDescription || null,
      seoKeywords: values.seoKeywords || null,
      gaId: values.gaId || null,
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('settings.tabs.seo')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-w-xl">
            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.seo.seo_title')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      placeholder={t('settings.seo.seo_title_placeholder')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seoDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.seo.seo_description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      placeholder={t('settings.seo.seo_description_placeholder')}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seoKeywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.seo.seo_keywords')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      placeholder={t('settings.seo.seo_keywords_placeholder')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.seo.ga_id')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      placeholder={t('settings.seo.ga_id_placeholder')}
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
