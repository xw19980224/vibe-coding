import { alova } from '@/service/request';

export const vibeWorksApi = {
  getWorks: (params?: Api.VibeCoding.VibeProjectSearchParams) =>
    alova.Get<Api.VibeCoding.VibeProjectPage>('/vibe-works', {
      params,
    }),

  getCategories: () => alova.Get<Api.VibeCoding.Category[]>('/vibe-works/categories'),

  getWorkById: (id: number | string) =>
    alova.Get<Api.VibeCoding.VibeProject>(`/vibe-works/${id}`),
};
