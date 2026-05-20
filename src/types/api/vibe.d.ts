declare namespace Api {
  namespace VibeCoding {
    interface Author {
      id: string;
      name: string;
      avatar: string;
      bio?: string;
    }

    type VibeProject = Common.CommonWaterfallItem<number, 'converUrl', {
      title: string;
      description: string;
      author: Author;
      tags: string[];
      category: string;
      likes: number;
      views: number;
      createdAt: string;
      vibePrompt?: string;
      codeSnippet?: string;
      link?: string;
      featured: boolean;
      status: WorkStatus;
    }>;

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
