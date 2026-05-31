import { BaseEntity } from './_base.entity';

export type ProjectEntity = BaseEntity & {
  title: string;
  description: string;
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  order: string;
  locale: string;
};
