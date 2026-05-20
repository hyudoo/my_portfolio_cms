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

export type ListProjectsQuery = ListQuery;

export type ProjectDetail = ProjectItem;

export type DetailProjectResponse = {
  project: ProjectDetail;
};

export type CreateProjectBody = Omit<ProjectEntity, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateProjectBody = Partial<ProjectEntity>;

export type DeleteProjectsBody = {
  ids: number[];
};
