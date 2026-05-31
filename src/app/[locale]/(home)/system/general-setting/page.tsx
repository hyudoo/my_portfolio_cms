'use client';

import { AboutSettingsTab } from '@/components/settings/about-settings-tab/AboutSettingsTab';
import { AppearanceSettingsTab } from '@/components/settings/appearance-settings-tab/AppearanceSettingsTab';
import { GeneralSettingsTab } from '@/components/settings/general-settings-tab/GeneralSettingsTab';
import { SeoSettingsTab } from '@/components/settings/seo-settings-tab/SeoSettingsTab';
import { SocialLinksTab } from '@/components/settings/social-links-tab/SocialLinksTab';
import { notify } from '@/components/layouts/app-layout/notify-provider/NotifyProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { settingRequest } from '@/requests/setting.request';
import { SettingEntity } from '@/types/entities/setting.entity';
import { UpdateSettingBody } from '@/types/requests/setting.type';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';

export default function SettingsPage() {
  const t = useTranslations();

  const [setting, setSetting] = useState<SettingEntity | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchSetting = useCallback(async () => {
    try {
      const { setting } = await settingRequest.get();
      setSetting(setting);
    } catch {}
  }, []);

  useEffect(() => {
    fetchSetting();
  }, [fetchSetting]);

  const handleSave = useCallback(
    async (body: UpdateSettingBody) => {
      setSaving(true);
      try {
        const { setting } = await settingRequest.update(body);
        setSetting(setting);
        notify.success(t('settings.messages.updated'));
      } finally {
        setSaving(false);
      }
    },
    [t],
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t('settings.subtitle')}</p>
      </div>
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">{t('settings.tabs.general')}</TabsTrigger>
          <TabsTrigger value="about">{t('settings.tabs.about')}</TabsTrigger>
          <TabsTrigger value="social">{t('settings.tabs.social')}</TabsTrigger>
          <TabsTrigger value="seo">{t('settings.tabs.seo')}</TabsTrigger>
          <TabsTrigger value="appearance">{t('settings.tabs.appearance')}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <GeneralSettingsTab setting={setting} onSave={handleSave} saving={saving} />
        </TabsContent>

        <TabsContent value="about" className="mt-4">
          <AboutSettingsTab setting={setting} onSave={handleSave} saving={saving} />
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
