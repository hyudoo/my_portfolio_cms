import { BaseEntity } from './_base.entity';
import { FileEntity } from './file.entity';

export type SettingEntity = BaseEntity & {
  // General
  locale: string;
  ownerName: string;
  heroTitle1: string;
  heroTitle2: string;
  bio: string;
  aboutContent: string;
  email: string;
  location: string;
  // Social
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  facebook: string | null;
  instagram: string | null;
  youtube: string | null;
  resumeUrl: string | null;
  // SEO
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  gaId: string | null;
  // Appearance
  showHero: boolean;
  showSkills: boolean;
  showProjects: boolean;
  showBlog: boolean;
  showAbout: boolean;
  showContact: boolean;
  sectionOrder: string;
  profileImageId: number | null;
  profileImage: FileEntity | null;
};
