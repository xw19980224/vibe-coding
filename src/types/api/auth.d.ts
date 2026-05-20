declare namespace Api {
  namespace Auth {

    interface LoginParams {
      email: string;
      code: string;
    }

    interface LoginToken {
      token: string;
    }

    interface User {
      id: string;
      email: string;
      nickname: string;
      introduction: string;
      avatar: string;
      phone: string;

    }
  }
}
