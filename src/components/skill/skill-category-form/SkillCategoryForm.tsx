'use client';

import { IconRenderer } from '@/components/common/icon-renderer/IconRenderer';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Language } from '@/enums/language.enum';
import { CreateSkillCategoryBody } from '@/types/requests/skill-category.type';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type SkillCategoryFormProps = {
  initialValue?: Partial<CreateSkillCategoryBody>;
  onChange: (value: Partial<CreateSkillCategoryBody>) => void;
};

export const SkillCategoryForm: React.FC<SkillCategoryFormProps> = ({ initialValue, onChange }) => {
  const t = useTranslations();
  const [value, setValue] = useState<Partial<CreateSkillCategoryBody>>({
    name: '',
    icon: null,
    locale: 'vi',
    ...initialValue,
  });

  const update = (patch: Partial<CreateSkillCategoryBody>) => {
    const next = { ...value, ...patch };
    setValue(next);
    onChange(next);
  };

  useEffect(() => {
    onChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>{t('skills.categories.form.name')}</Label>
        <Input
          value={value.name ?? ''}
          onChange={(e) => update({ name: e.target.value })}
          placeholder={t('skills.categories.form.name_placeholder')}
        />
      </div>
      <div className="space-y-1.5">
        <Label>{t('skills.categories.form.icon')}</Label>
        <InputGroup>
          <InputGroupInput
            value={value.icon ?? ''}
            onChange={(e) => update({ icon: e.target.value || null })}
            placeholder={t('skills.categories.form.icon_placeholder')}
          />
          <InputGroupAddon align="inline-end">
            <IconRenderer
              icon={value.icon}
              size={16}
              fallback={<span className="text-muted-foreground text-xs select-none">—</span>}
            />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="space-y-1.5">
        <Label>{t('skills.categories.form.locale')}</Label>
        <Select value={value.locale ?? 'vi'} onValueChange={(val) => update({ locale: val as 'vi' | 'en' })}>
          <SelectTrigger>
            <SelectValue placeholder={t('skills.categories.form.locale_placeholder')} />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Language).map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
