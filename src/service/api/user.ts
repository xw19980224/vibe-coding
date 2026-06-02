import { alova } from '@/service/request';

const USER_BASE_URL = '/user';

export const UserAPI = {

  getUserDetail(nickname: Api.User.UserInfo['nickname']) {
    return alova.Get<Api.User.UserDetail>(`${USER_BASE_URL}/detail`, { params: { nickname } });
  },

  findUserVibeCoding(params: Api.User.UserVibeCodingSearchParams) {
    return alova.Get<Api.VibeCoding.VibeCodingPage>(`${USER_BASE_URL}/vibecoding`, { params });
  },
  editUserInfo(data: Omit<Api.User.UserInfo, 'id'>) {
    return alova.Put<boolean>(`${USER_BASE_URL}`, data);
  },
};
