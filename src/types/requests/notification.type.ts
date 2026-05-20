import { ListQuery } from '../common/list-query.type';
import { NotificationEntity } from '../entities/notification.entity';

export type NotificationItem = NotificationEntity;

export type ListNotificationsResponse = {
  notifications: NotificationItem[];
  total: number;
};

export type ListNotificationsQuery = ListQuery;

export type NotificationDetail = NotificationItem;

export type DetailNotificationResponse = {
  notification: NotificationDetail;
};

export type CreateNotificationBody = Omit<NotificationEntity, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateNotificationBody = Partial<NotificationEntity>;

export type DeleteNotificationsBody = {
  ids: number[];
};
