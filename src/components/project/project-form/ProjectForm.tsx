'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Language } from '@/enums/language.enum';
import { projectCategoryRequest } from '@/requests/project-category.request';
import { skillRequest } from '@/requests/skill.request';
import { ProjectCategoryItem } from '@/types/requests/project-category.type';
import { CreateProjectBody } from '@/types/requests/project.type';
import { SkillItem } from '@/types/requests/skill.type';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type ProjectFormProps = {
  initialValue?: Partial<CreateProjectBody>;
  onChange: (value: Partial<CreateProjectBody>) => void;
};

export const ProjectForm: React.FC<ProjectFormProps> = ({ initialValue, onChange }) => {
  const t = useTranslations();
  const [value, setValue] = useState<Partial<CreateProjectBody>>({
    title: '',
    description: '',
    liveUrl: null,
    githubUrl: null,
    featured: false,
    locale: 'vi',
    skillIds: [],
    categoryIds: [],
    ...initialValue,
  });
  const [categories, setCategories] = useState<ProjectCategoryItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);

  useEffect(() => {
    Promise.all([projectCategoryRequest.list({ take: 100, skip: 0 }), skillRequest.list({ take: 200, skip: 0 })]).then(
      ([catRes, skillRes]) => {
        setCategories(catRes.projectCategories);
        setSkills(skillRes.skills);
      },
    );
  }, []);

  const update = (patch: Partial<CreateProjectBody>) => {
    const next = { ...value, ...patch };
    setValue(next);
    onChange(next);
  };

  useEffect(() => {
    onChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCategory = (id: number) => {
    const current = value.categoryIds ?? [];
    const next = current.includes(id) ? current.filter((c) => c !== id) : [...current, id];
    update({ categoryIds: next });
  };

  const toggleSkill = (id: number) => {
    const current = value.skillIds ?? [];
    const next = current.includes(id) ? current.filter((s) => s !== id) : [...current, id];
    update({ skillIds: next });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>{t('projects.projects_list.form.title')}</Label>
        <Input
          value={value.title ?? ''}
          onChange={(e) => update({ title: e.target.value })}
          placeholder={t('projects.projects_list.form.title_placeholder')}
        />
      </div>
      <div className="space-y-1.5">
        <Label>{t('projects.projects_list.form.description')}</Label>
        <Textarea
          value={value.description ?? ''}
          onChange={(e) => update({ description: e.target.value })}
          placeholder={t('projects.projects_list.form.description_placeholder')}
          rows={4}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>{t('projects.projects_list.form.live_url')}</Label>
          <Input
            value={value.liveUrl ?? ''}
            onChange={(e) => update({ liveUrl: e.target.value || null })}
            placeholder="https://..."
          />
        </div>
        <div className="space-y-1.5">
          <Label>{t('projects.projects_list.form.github_url')}</Label>
          <Input
            value={value.githubUrl ?? ''}
            onChange={(e) => update({ githubUrl: e.target.value || null })}
            placeholder="https://github.com/..."
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={value.featured ?? false} onCheckedChange={(checked) => update({ featured: checked })} />
        <Label>{t('projects.projects_list.form.featured')}</Label>
      </div>
      <div className="space-y-1.5">
        <Label>{t('projects.projects_list.form.locale')}</Label>
        <Select value={value.locale ?? 'vi'} onValueChange={(val) => update({ locale: val as 'vi' | 'en' })}>
          <SelectTrigger>
            <SelectValue placeholder={t('projects.projects_list.form.locale_placeholder')} />
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
      {categories.length > 0 && (
        <div className="space-y-2">
          <Label>{t('projects.projects_list.form.categories')}</Label>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2">
                <Checkbox
                  id={`cat-${cat.id}`}
                  checked={(value.categoryIds ?? []).includes(cat.id)}
                  onCheckedChange={() => toggleCategory(cat.id)}
                />
                <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer font-normal">
                  {cat.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
      {skills.length > 0 && (
        <div className="space-y-2">
          <Label>{t('projects.projects_list.form.skills')}</Label>
          <div className="flex flex-wrap gap-x-4 gap-y-2 max-h-40 overflow-y-auto pr-1">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-2">
                <Checkbox
                  id={`skill-${skill.id}`}
                  checked={(value.skillIds ?? []).includes(skill.id)}
                  onCheckedChange={() => toggleSkill(skill.id)}
                />
                <Label htmlFor={`skill-${skill.id}`} className="cursor-pointer font-normal">
                  {skill.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

