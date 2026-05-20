import { ContactStatus } from '../../enums/contact-status.enum';
import { BaseEntity } from './_base.entity';

export type ContactEntity = BaseEntity & {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  readAt: string | null;
};
