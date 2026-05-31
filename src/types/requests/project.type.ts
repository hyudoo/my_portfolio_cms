import { ListQuery } from '../common/list-query.type';
import { FileEntity } from '../entities/file.entity';
import { ProjectCategoryEntity } from '../entities/project-category.entity';
import { ProjectEntity } from '../entities/project.entity';
import { SkillEntity } from '../entities/skill.entity';

export type ProjectItem = ProjectEntity & {
  files?: FileEntity[];
  skills?: SkillEntity[];
  categories?: ProjectCategoryEntity[];
};

export type ListProjectsResponse = {
  projects: ProjectItem[];
  total: number;
};

export type ListProjectsQuery = ListQuery & {
  locale?: string | null;
};

export type ProjectDetail = ProjectItem;

export type DetailProjectResponse = {
  project: ProjectDetail;
};

export type CreateProjectBody = Omit<ProjectEntity, 'id' | 'createdAt' | 'updatedAt'> & {
  skillIds?: number[];
  categoryIds?: number[];
};

export type UpdateProjectBody = Partial<CreateProjectBody>;

export type DeleteProjectsBody = {
  ids: number[];
};
