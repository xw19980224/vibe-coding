declare namespace Api {
  namespace User {

    type UserWorksSearchParams = CommonType.RecordNullable<
      Pick<VibeProject, 'status'> &
      Common.CommonSearchParams
    >;



    interface UserStats {
      works: number;
      collections: number;
      likes: number;
      following: number;
      followers: number;
    }
  }
}
