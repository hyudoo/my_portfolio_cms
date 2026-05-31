'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { SettingEntity } from '@/types/entities/setting.entity';
import { UpdateSettingBody } from '@/types/requests/setting.type';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type SectionKey = 'showHero' | 'showAbout' | 'showSkills' | 'showProjects' | 'showBlog' | 'showContact';

const SECTION_KEYS: SectionKey[] = [
  'showHero',
  'showAbout',
  'showSkills',
  'showProjects',
  'showBlog',
  'showContact',
];

const LABEL_MAP: Record<SectionKey, string> = {
  showHero: 'show_hero',
  showAbout: 'show_about',
  showSkills: 'show_skills',
  showProjects: 'show_projects',
  showBlog: 'show_blog',
  showContact: 'show_contact',
};

type Props = {
  setting: SettingEntity;
  onSave: (body: UpdateSettingBody) => Promise<void>;
  saving: boolean;
};

export function AppearanceSettingsTab({ setting, onSave, saving }: Props) {
  const t = useTranslations();

  const [sections, setSections] = useState<Record<SectionKey, boolean>>({
    showHero: setting.showHero,
    showAbout: setting.showAbout,
    showSkills: setting.showSkills,
    showProjects: setting.showProjects,
    showBlog: setting.showBlog,
    showContact: setting.showContact,
  });

  const handleSave = () => onSave(sections);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('settings.tabs.appearance')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm font-medium mb-1">{t('settings.appearance.sections_title')}</p>
          <p className="text-xs text-muted-foreground mb-4">{t('settings.appearance.sections_subtitle')}</p>
          <div className="space-y-3">
            {SECTION_KEYS.map((key) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm">{t(`settings.appearance.${LABEL_MAP[key]}`)}</span>
                <Switch
                  checked={sections[key]}
                  onCheckedChange={(checked) => setSections((prev) => ({ ...prev, [key]: checked }))}
                />
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? t('common.saving') : t('common.save')}
        </Button>
      </CardContent>
    </Card>
  );
}
