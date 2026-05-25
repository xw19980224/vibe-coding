import { alova } from '@/service/request';

export const UserAPI = {
  getUserInfo() {
    return alova.Get<Api.User.UserInfo>('/user/info');
  },

  getUserDetail(nickname: Api.User.UserInfo['nickname']) {
    return alova.Get<Api.User.UserDetail>('/user/detail', { params: { nickname } });
  },

  getUserWorks(params: Api.User.UserWorksSearchParams) {
    return alova.Get<Api.VibeCoding.VibeProjectPage>('/user/works', { params });
  },
};
