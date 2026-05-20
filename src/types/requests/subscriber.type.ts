import { ListQuery } from '../common/list-query.type';
import { SubscriberEntity } from '../entities/subscriber.entity';

export type SubscriberItem = SubscriberEntity;

export type ListSubscribersResponse = {
  subscribers: SubscriberItem[];
  total: number;
};

export type ListSubscribersQuery = ListQuery;

export type SubscriberDetail = SubscriberItem;

export type DetailSubscriberResponse = {
  subscriber: SubscriberDetail;
};

export type CreateSubscriberBody = Omit<SubscriberEntity, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateSubscriberBody = Partial<SubscriberEntity>;

export type DeleteSubscribersBody = {
  ids: number[];
};
