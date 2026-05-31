'use client';

import { ProfileInfoTab } from '@/components/profile/profile-info-tab/ProfileInfoTab';
import { UpdatePasswordTab } from '@/components/profile/update-password-tab/UpdatePasswordTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
  const t = useTranslations();

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('profile.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t('profile.subtitle')}</p>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">{t('profile.tabs.info')}</TabsTrigger>
          <TabsTrigger value="security">{t('profile.tabs.security')}</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <ProfileInfoTab />
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <UpdatePasswordTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
