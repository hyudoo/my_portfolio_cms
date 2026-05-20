import { ListQuery } from '../common/list-query.type';
import { ContactEntity } from '../entities/contact.entity';

export type ContactItem = ContactEntity;

export type ListContactsResponse = {
  contacts: ContactItem[];
  total: number;
};

export type ListContactsQuery = ListQuery;

export type ContactDetail = ContactItem;

export type DetailContactResponse = {
  contact: ContactDetail;
};

export type CreateContactBody = Omit<ContactEntity, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateContactBody = Partial<ContactEntity>;

export type DeleteContactsBody = {
  ids: number[];
};
