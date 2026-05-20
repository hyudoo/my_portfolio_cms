import { ListQuery } from '../common/list-query.type';
import { SubscriberEntity } from '../entities/subscriber.entity';
import { UserEntity } from '../entities/user.entity';
import { VerificationCodeEntity } from '../entities/verification-code.entity';

export type VerificationCodeItem = VerificationCodeEntity & {
  user?: UserEntity | null;
  subscriber?: SubscriberEntity | null;
};

export type ListVerificationCodesResponse = {
  verificationCodes: VerificationCodeItem[];
  total: number;
};

export type ListVerificationCodesQuery = ListQuery;

export type VerificationCodeDetail = VerificationCodeItem;

export type DetailVerificationCodeResponse = {
  verificationCode: VerificationCodeDetail;
};

export type CreateVerificationCodeBody = Omit<VerificationCodeEntity, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateVerificationCodeBody = Partial<VerificationCodeEntity>;

export type DeleteVerificationCodesBody = {
  ids: number[];
};
