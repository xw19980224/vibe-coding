import { alova } from '@/service/request';

export const UserApi = {
  getStats() {
    return alova.Get<Api.User.UserStats>('/user/stats')
  },

  getUserWorks(params: Api.User.UserWorksSearchParams) {
    return alova.Get<Api.VibeCoding.VibeProjectPage>('/user/works', { params })
  },
};
