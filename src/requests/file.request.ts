import {
  DeleteFilesBody,
  GetPresignedUrlBody,
  GetPresignedUrlResponse,
  SaveFileMetadataBody,
  SaveFileMetadataResponse,
} from '../types/requests/file.type';
import { api } from '../utils/api.util';

export const fileRequest = {
  getPresignedUrl: async (body: GetPresignedUrlBody) => {
    const { data } = await api.post<GetPresignedUrlResponse>('/files/presigned-url', body);
    return data;
  },

  saveMetadata: async (body: SaveFileMetadataBody) => {
    const { data } = await api.post<SaveFileMetadataResponse>('/files/metadata', body);
    return data;
  },

  delete: async (body: DeleteFilesBody) => {
    const { data } = await api.delete('/files', { data: body });
    return data;
  },
};
