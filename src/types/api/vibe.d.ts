declare namespace Api {
  namespace VibeCoding {
    interface Author {
      id: string;
      name: string;
      avatar: string;
      bio?: string;
    }

    type VibeProject = {
      id: number;
      coverUrl: string;
      title: string;
      description: string;
      author: Author;
      tags: string[];
      category: string;
      /** 运行平台 */
      platform: RuntimePlatform;
      likes: number;
      views: number;
      screenshots: string[];
      vibePrompt?: string;
      link?: string;
      featured: boolean;
      status: WorkStatus;
      createdAt: string;
    }

    type VibeProjectPage = Common.PaginatingQueryRecord<VibeProject>;

    type VibeProjectSearchParams = CommonType.RecordNullable<
      Pick<VibeProject, 'title' | 'category' | 'tags'> &
      Common.CommonSearchParams & {
        sort?: SortMode;
      }
    >;

    /**
     * 作品状态
     * - 1: 草稿
     * - 2: 待审核
     * - 3: 审核中
     * - 4: 通过
     * - 5: 驳回
     * - 6: 待调整
     * - 7: 已发布
     * - 8: 下架
     * - 9: 删除
     * - 10: 封禁
     */
    type WorkStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

    /**
     * 运行平台
     * - web: Web 浏览器
     * - ios: iOS
     * - android: Android
     * - desktop: 桌面端
     * - mini-program: 小程序
     * - cross: 跨平台
     */
    type RuntimePlatform = 'web' | 'ios' | 'android' | 'desktop' | 'mini-program' | 'cross';

    interface Category {
      id: string;
      name: string;
      nameEn: string;
    }

    type SortMode = 'recommended' | 'latest' | 'popular';

    interface WorkFilters {
      category: string;
      sort: SortMode;
      search: string;
    }

    interface Comment {
      id: string;
      workId: string;
      author: Author;
      content: string;
      createdAt: string;
      likes: number;
    }

    interface PublishForm {
      title: string;
      description: string;
      category: string;
      tags: string[];
      vibePrompt: string;
      codeSnippet: string;
      link: string;
    }
  }
}
