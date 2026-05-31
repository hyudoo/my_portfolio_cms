import { ListQuery } from '../common/list-query.type';
import { ProjectCategoryEntity } from '../entities/project-category.entity';

export type ProjectCategoryItem = ProjectCategoryEntity;

export type ListProjectCategoriesResponse = {
  projectCategories: ProjectCategoryItem[];
  total: number;
};

export type ListProjectCategoriesQuery = ListQuery & {
  locale?: string | null;
};

export type ProjectCategoryDetail = ProjectCategoryItem;

export type DetailProjectCategoryResponse = {
  projectCategory: ProjectCategoryDetail;
};

export type CreateProjectCategoryBody = Omit<ProjectCategoryEntity, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateProjectCategoryBody = Partial<ProjectCategoryEntity>;

export type DeleteProjectCategoriesBody = {
  ids: number[];
};
