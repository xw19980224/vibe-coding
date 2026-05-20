declare namespace Api {
  namespace User {

    interface UserDetail {
      id: string;
      email: string;
      nickname: string;
      introduction: string;
      avatar: string;
      phone: string;
      githubUrl: string;
      rednoteUrl: string;
      bilibiliUrl: string;
      juejinUrl: string;
      weiboUrl: string;
      portalUrl: string;
      works: number;
      collections: number;
      likes: number;
      following: number;
      followers: number;
    }

    type UserInfo = Pick<
      UserDetail,
      | 'id'
      | 'email'
      | 'nickname'
      | 'introduction'
      | 'avatar'
      | 'phone'
      | 'githubUrl'
      | 'rednoteUrl'
      | 'bilibiliUrl'
      | 'juejinUrl'
      | 'weiboUrl'
      | 'portalUrl'
    >;

    type UserWorksSearchParams = CommonType.RecordNullable<
      Pick<VibeProject, 'status'> &
      Common.CommonSearchParams
    >;

    type UserDetailSearchParams = CommonType.RecordNullable<Pick<UserInfo, 'nickname'>>;
  }
}
