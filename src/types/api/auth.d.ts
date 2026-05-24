declare namespace Api {
  namespace Auth {
    interface LoginParams {
      email: string;
      code: string;
    }

    interface LoginToken {
      token: string;
    }

    type UserInfo = Pick<Api.User.UserInfo, 'id' | 'nickname' | 'avatar'>;
  }
}
