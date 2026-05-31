import { GetSettingResponse, UpdateSettingBody } from '../types/requests/setting.type';
import { api } from '../utils/api.util';

export const settingRequest = {
  get: async (locale: string = 'vi') => {
    const { data } = await api.get<GetSettingResponse>('/general-setting', { params: { locale } });
    return data;
  },

  update: async (body: UpdateSettingBody) => {
    const { data } = await api.put<GetSettingResponse>('/general-setting', body);
    return data;
  },
};
