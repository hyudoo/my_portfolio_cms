import { BaseEntity } from './_base.entity';

export type ProjectCategoryEntity = BaseEntity & {
  name: string;
  slug: string;
  order: number;
};
