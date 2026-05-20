import { defineStore } from 'pinia';
import { SetupStoreId } from '@/enum';
import { VibeWorksAPI } from '@/service/api/vibe-works';

export const useVibeStore = defineStore(SetupStoreId.Vibe, () => {
  const categories = ref<Api.VibeCoding.Category[]>([]);
  const categoriesLoading = ref(false);
  const currentWork = ref<Api.VibeCoding.VibeProject | null>(null);
  const loading = ref(false);
  const filters = ref<Api.VibeCoding.WorkFilters>({
    category: 'all',
    sort: 'latest',
    search: '',
  });

  async function fetchCategories() {
    categoriesLoading.value = true;
    try {
      categories.value = await VibeWorksAPI.getCategories().send();
    } finally {
      categoriesLoading.value = false;
    }
  }

  async function fetchWorkById(id: number | string) {
    loading.value = true;
    currentWork.value = null;
    try {
      currentWork.value = await VibeWorksAPI.getWorkById(id).send();
    } finally {
      loading.value = false;
    }
  }

  function setCategory(category: string) {
    filters.value.category = category;
  }

  function setSort(sort: Api.VibeCoding.SortMode) {
    filters.value.sort = sort;
  }

  function setSearch(query: string) {
    filters.value.search = query;
  }

  return {
    categories,
    categoriesLoading,
    currentWork,
    loading,
    filters,
    fetchCategories,
    fetchWorkById,
    setCategory,
    setSort,
    setSearch,
  };
});
