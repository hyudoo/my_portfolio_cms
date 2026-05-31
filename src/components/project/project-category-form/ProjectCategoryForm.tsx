'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Language } from '@/enums/language.enum';
import { CreateProjectCategoryBody } from '@/types/requests/project-category.type';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type ProjectCategoryFormProps = {
  initialValue?: Partial<CreateProjectCategoryBody>;
  onChange: (value: Partial<CreateProjectCategoryBody>) => void;
};

const toSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

export const ProjectCategoryForm: React.FC<ProjectCategoryFormProps> = ({ initialValue, onChange }) => {
  const t = useTranslations();
  const [value, setValue] = useState<Partial<CreateProjectCategoryBody>>({
    name: '',
    slug: '',
    locale: 'vi',
    ...initialValue,
  });
  const [slugTouched, setSlugTouched] = useState(!!initialValue?.slug);

  const update = (patch: Partial<CreateProjectCategoryBody>) => {
    const next = { ...value, ...patch };
    setValue(next);
    onChange(next);
  };

  const handleNameChange = (name: string) => {
    if (!slugTouched) {
      update({ name, slug: toSlug(name) });
    } else {
      update({ name });
    }
  };

  const handleSlugChange = (slug: string) => {
    setSlugTouched(true);
    update({ slug });
  };

  useEffect(() => {
    onChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>{t('projects.categories.form.name')}</Label>
        <Input
          value={value.name ?? ''}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder={t('projects.categories.form.name_placeholder')}
        />
      </div>
      <div className="space-y-1.5">
        <Label>{t('projects.categories.form.slug')}</Label>
        <Input
          value={value.slug ?? ''}
          onChange={(e) => handleSlugChange(e.target.value)}
          placeholder={t('projects.categories.form.slug_placeholder')}
        />
      </div>
      <div className="space-y-1.5">
        <Label>{t('projects.categories.form.locale')}</Label>
        <Select value={value.locale ?? 'vi'} onValueChange={(val) => update({ locale: val as 'vi' | 'en' })}>
          <SelectTrigger>
            <SelectValue placeholder={t('projects.categories.form.locale_placeholder')} />
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

