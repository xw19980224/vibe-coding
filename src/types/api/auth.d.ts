declare namespace Api {
  namespace Auth {
    interface LoginParams {
      clientType: string;
      loginType: string;
      email: string;
      emailCode: string;
    }

    interface LoginToken {
      token: string;
    }

    type UserInfo = Pick<Api.User.UserInfo, 'id' | 'nickname' | 'avatar'>;
  }
}
