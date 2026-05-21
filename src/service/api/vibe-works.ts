import { alova } from '@/service/request';

export const VibeWorksAPI = {
  getWorks(params: Api.VibeCoding.VibeProjectSearchParams) {
    return alova.Get<Api.VibeCoding.VibeProjectPage>('/vibe-works', {
      params,
    })
  },
  getCategories() {
    return alova.Get<Api.VibeCoding.Category[]>('/vibe-works/categories')
  },
  getWorkById(id: number | string) {
    return alova.Get<Api.VibeCoding.VibeProject>(`/vibe-works/${id}`)
  },

};
