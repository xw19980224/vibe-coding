import { alova } from '@/service/request';

const VITE_CODEING_BASE_URL = "/vibecoding"

export const VibeCodingAPI = {
  findVibeCodingPage(params: Api.VibeCoding.VibeCodingSearchParams) {
    return alova.Get<Api.VibeCoding.VibeCodingPage>(`${VITE_CODEING_BASE_URL}`, {
      params,
    });
  },
  getVibeCodingById(id: number | string) {
    return alova.Get<Api.VibeCoding.VibeCodingInfo>(`${VITE_CODEING_BASE_URL}/${id}`);
  },
  publishVibeCoding(data: Api.VibeCoding.publishVibeCodingForm) {
    return alova.Post<boolean>(`${VITE_CODEING_BASE_URL}/submit`, data)
  }
};
