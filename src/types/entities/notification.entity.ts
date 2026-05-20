import { NotificationType } from '../../enums/notification-type.enum';
import { BaseEntity } from './_base.entity';

export type NotificationEntity = BaseEntity & {
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  readAt: Date | null;
  metadata: Record<string, unknown> | null;
};
