import { ListQuery } from '../common/list-query.type';
import { SkillCategoryEntity } from '../entities/skill-category.entity';
import { SkillEntity } from '../entities/skill.entity';

export type SkillCategoryItem = SkillCategoryEntity & {
  skills?: SkillEntity[];
};

export type ListSkillCategoriesResponse = {
  skillCategories: SkillCategoryItem[];
  total: number;
};

export type ListSkillCategoriesQuery = ListQuery & {
  locale?: string | null;
};

export type SkillCategoryDetail = SkillCategoryItem;

export type DetailSkillCategoryResponse = {
  skillCategory: SkillCategoryDetail;
};

export type CreateSkillCategoryBody = Omit<SkillCategoryEntity, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateSkillCategoryBody = Partial<SkillCategoryEntity>;

export type DeleteSkillCategoriesBody = {
  ids: number[];
};
