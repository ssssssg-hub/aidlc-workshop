import api from './api';
import { ImageResponse } from '../types';

export const imageService = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<ImageResponse>('/admin/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
  },

  getUrl: (filename: string) =>
    `${api.defaults.baseURL}/images/${filename}`,
};
