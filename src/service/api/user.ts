import { alova } from '@/service/request';

const USER_BASE_URL = '/user';

export const UserAPI = {
  getUserInfo() {
    return alova.Get<Api.User.UserInfo>(`${USER_BASE_URL}/info`);
  },

  getUserDetail(nickname: Api.User.UserInfo['nickname']) {
    return alova.Get<Api.User.UserDetail>(`${USER_BASE_URL}/detail`, { params: { nickname } });
  },

  getUserWorks(params: Api.User.UserWorksSearchParams) {
    return alova.Get<Api.VibeCoding.VibeProjectPage>(`${USER_BASE_URL}/works`, { params });
  },
};
