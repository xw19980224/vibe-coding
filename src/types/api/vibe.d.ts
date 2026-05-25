declare namespace Api {
  namespace VibeCoding {
    interface Author {
      id: string;
      name: string;
      avatar: string;
      bio?: string;
      /** 社交链接 */
      githubUrl?: string;
      rednoteUrl?: string;
      bilibiliUrl?: string;
      juejinUrl?: string;
      weiboUrl?: string;
      portalUrl?: string;
      /** 统计数据 */
      works?: number;
      likes?: number;
      following?: number;
      followers?: number;
    }

    type VibeProject = {
      id: number;
      /** 作品名称 */
      title: string;
      /** 作品副标题 */
      subtitle?: string;
      /** 作品分类 */
      category: string;
      /** 运行平台 */
      platform: RuntimePlatform;
      /** 开发语言 */
      languages?: string[];
      /** 作品描述 */
      description: string;
      /** 使用说明 */
      instructions?: string;
      /** 作品封面 */
      coverUrl: string;
      /** 作品标签 */
      tags: string[];
      /** 是否推荐 */
      featured?: boolean;
      /** 运行平台 */
      likes: number;
      /** 浏览量 */
      views: number;
      /** 作品截图 */
      screenshots: string[];
      /** 在线演示地址 */
      demoUrl?: string;
      /** 源码仓库地址 */
      repoUrl?: string;
      /** 开发周期 */
      duration?: string;
      /** 开发工具 */
      tools?: string[];
      /** 使用的 AI 模型 */
      model?: string;
      /** 使用的 MCP 工具 */
      mcps?: string[];
      /** 使用的 Skills */
      skills?: string[];
      /** 是否已上线 */
      isOnline?: boolean;
      /** 上线日期 */
      onlineDate?: string;
      /** 许可证类型 */
      license?: string;
      /** 作品状态 */
      status: WorkStatus;
      /** 作者 */
      author?: Author;
      createdAt: string;
    };

    type publishVibeProjectForm = Pick<
      VibeProject,
      | 'title'
      | 'category'
      | 'platform'
      | 'languages'
      | 'description'
      | 'coverUrl'
      | 'tags'
      | 'likes'
      | 'views'
      | 'screenshots'
      | 'demoUrl'
      | 'repoUrl'
      | 'duration'
      | 'tools'
      | 'model'
      | 'mcps'
      | 'skills'
      | 'instructions'
      | 'isOnline'
      | 'onlineDate'
      | 'license'
      | 'featured'
    >;

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
      id: number;
      code: string;
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
  }
}
