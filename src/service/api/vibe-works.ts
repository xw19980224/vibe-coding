import { alova } from '@/service/request';

const VITE_CODEING_BASE_URL = "/vibecoding"

export const VibeCodingAPI = {
  getWorks(params: Api.VibeCoding.VibeProjectSearchParams) {
    return alova.Get<Api.VibeCoding.VibeProjectPage>(`${VITE_CODEING_BASE_URL}`, {
      params,
    });
  },
  getCategories() {
    return alova.Get<Api.VibeCoding.Category[]>(`${VITE_CODEING_BASE_URL}/categories`);
  },
  getWorkById(id: number | string) {
    return alova.Get<Api.VibeCoding.VibeProject>(`${VITE_CODEING_BASE_URL}/${id}`);
  },
  publish(data: Api.VibeCoding.publishVibeProjectForm) {
    return alova.Post<boolean>(`${VITE_CODEING_BASE_URL}/sumbit`, data)
  }
};
