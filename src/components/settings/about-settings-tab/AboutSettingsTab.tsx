'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RichTextEditor } from '@/components/input/rich-text-editor/RichTextEditor';
import { SettingEntity } from '@/types/entities/setting.entity';
import { UpdateSettingBody } from '@/types/requests/setting.type';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Props = {
  setting: SettingEntity;
  onSave: (body: UpdateSettingBody) => Promise<void>;
  saving: boolean;
};

export function AboutSettingsTab({ setting, onSave, saving }: Props) {
  const t = useTranslations();
  const [content, setContent] = useState(setting.aboutContent ?? '');

  const handleSave = () => onSave({ aboutContent: content });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('settings.tabs.about')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-1">{t('settings.about.content_label')}</p>
          <p className="text-xs text-muted-foreground mb-3">{t('settings.about.content_hint')}</p>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder={t('settings.about.content_placeholder')}
            disabled={saving}
          />
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? t('common.saving') : t('common.save')}
        </Button>
      </CardContent>
    </Card>
  );
}
