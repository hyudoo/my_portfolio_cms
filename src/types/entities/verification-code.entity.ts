import { CodeType } from '../../enums/code-type.enum';
import { BaseEntity } from './_base.entity';

export type VerificationCodeEntity = BaseEntity & {
  code: string;
  type: CodeType;
  expiresAt: string;
  userId: number | null;
  subscriberId: number | null;
};
