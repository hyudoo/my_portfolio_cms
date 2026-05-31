import { SettingEntity } from '../entities/setting.entity';

export type GetSettingResponse = {
  setting: SettingEntity;
};

export type UpdateSettingBody = Partial<Omit<SettingEntity, 'id' | 'createdAt' | 'updatedAt'>>;
