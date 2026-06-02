import { alova } from '@/service/request';

export const TagDictAPI = {
  listByType(type: string) {
    return alova.Get<string[]>(`/tag-dict/list`, { params: { type } });
  },
};
