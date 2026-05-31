import { BaseEntity } from './_base.entity';

export type SkillCategoryEntity = BaseEntity & {
  name: string;
  icon: string | null;
  order: string;
  locale: string;
};
