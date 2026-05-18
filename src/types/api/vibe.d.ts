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
    }>;

    type VibeProjectPage = Common.PaginatingQueryRecord<VibeProject>;

    type VibeProjectSearchParams = CommonType.RecordNullable<
      Pick<VibeProject, 'title' | 'category' | 'tags'> &
      Common.CommonSearchParams & {
        sort?: SortMode;
      }
    >;

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
