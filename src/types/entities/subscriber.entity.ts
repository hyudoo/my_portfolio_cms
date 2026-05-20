import { BaseEntity } from './_base.entity';

export type SubscriberEntity = BaseEntity & {
  email: string;
  confirmedAt: string | null;
};
