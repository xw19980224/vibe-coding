declare namespace VibeCoding {
  interface Author {
    id: string;
    name: string;
    avatar: string;
    bio?: string;
  }

  interface VibeWork {
    id: string;
    title: string;
    description: string;
    coverUrl: string;
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
  }

  interface Category {
    id: string;
    name: string;
    nameEn: string;
  }

  type SortMode = 'latest' | 'popular';

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
