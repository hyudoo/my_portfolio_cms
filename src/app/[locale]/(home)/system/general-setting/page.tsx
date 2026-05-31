'use client';

import { AppearanceSettingsTab } from '@/components/settings/appearance-settings-tab/AppearanceSettingsTab';
import { GeneralSettingsTab } from '@/components/settings/general-settings-tab/GeneralSettingsTab';
import { SeoSettingsTab } from '@/components/settings/seo-settings-tab/SeoSettingsTab';
import { SocialLinksTab } from '@/components/settings/social-links-tab/SocialLinksTab';
import { notify } from '@/components/layouts/app-layout/notify-provider/NotifyProvider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Language } from '@/enums/language.enum';
import { settingRequest } from '@/requests/setting.request';
import { SettingEntity } from '@/types/entities/setting.entity';
import { UpdateSettingBody } from '@/types/requests/setting.type';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';

export default function GeneralSettingPage() {
  const t = useTranslations();

  const [locale, setLocale] = useState<string>(Language.Vi);
  const [setting, setSetting] = useState<SettingEntity | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchSetting = useCallback(async () => {
    setSetting(null);
    try {
      const { setting } = await settingRequest.get(locale);
      setSetting(setting);
    } catch {}
  }, [locale]);

  useEffect(() => {
    fetchSetting();
  }, [fetchSetting]);

  const handleSave = useCallback(
    async (body: UpdateSettingBody) => {
      setSaving(true);
      try {
        const { setting } = await settingRequest.update({ ...body, locale });
        setSetting(setting);
        notify.success(t('settings.messages.updated'));
      } finally {
        setSaving(false);
      }
    },
    [t, locale],
  );

  if (!setting) {
    return (
      <div className="p-8">
        <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
        <div className="h-4 w-72 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('settings.subtitle')}</p>
        </div>
        <Select value={locale} onValueChange={(val) => setLocale(val)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Language).map((lang) => (
              <SelectItem key={lang} value={lang}>
                {t(`common.locale_${lang}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">{t('settings.tabs.general')}</TabsTrigger>
          <TabsTrigger value="social">{t('settings.tabs.social')}</TabsTrigger>
          <TabsTrigger value="seo">{t('settings.tabs.seo')}</TabsTrigger>
          <TabsTrigger value="appearance">{t('settings.tabs.appearance')}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <GeneralSettingsTab setting={setting} onSave={handleSave} saving={saving} />
        </TabsContent>

        <TabsContent value="social" className="mt-4">
          <SocialLinksTab setting={setting} onSave={handleSave} saving={saving} />
        </TabsContent>

        <TabsContent value="seo" className="mt-4">
          <SeoSettingsTab setting={setting} onSave={handleSave} saving={saving} />
        </TabsContent>

        <TabsContent value="appearance" className="mt-4">
          <AppearanceSettingsTab setting={setting} onSave={handleSave} saving={saving} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
