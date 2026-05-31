import { BaseEntity } from './_base.entity';

export type SkillEntity = BaseEntity & {
  name: string;
  icon: string | null;
  order: string;
  categoryId: number;
  locale: string;
};
