import { ListQuery } from '../common/list-query.type';
import { SkillCategoryEntity } from '../entities/skill-category.entity';
import { SkillEntity } from '../entities/skill.entity';

export type SkillItem = SkillEntity & {
  category?: SkillCategoryEntity;
};

export type ListSkillsResponse = {
  skills: SkillItem[];
  total: number;
};

export type ListSkillsQuery = ListQuery & {
  categoryId?: number | null;
  locale?: string | null;
};

export type SkillDetail = SkillItem;

export type DetailSkillResponse = {
  skill: SkillDetail;
};

export type CreateSkillBody = Omit<SkillEntity, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateSkillBody = Partial<SkillEntity>;

export type DeleteSkillsBody = {
  ids: number[];
};
