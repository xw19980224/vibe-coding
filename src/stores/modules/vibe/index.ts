import { defineStore } from 'pinia';
import { SetupStoreId } from '@/enum';
import { getMockWorks, getMockWorkById, mockCategories } from '@/service/mocks/vibe-works';
export const useVibeStore = defineStore(SetupStoreId.Vibe, () => {
  const works = ref<VibeCoding.VibeWork[]>([]);
  const currentWork = ref<VibeCoding.VibeWork | null>(null);
  const categories = ref<VibeCoding.Category[]>(mockCategories);
  const filters = ref<VibeCoding.WorkFilters>({
    category: 'all',
    sort: 'latest',
    search: '',
  });
  const loading = ref(false);

  const filteredWorks = computed(() => getMockWorks(filters.value));

  function fetchWorks() {
    loading.value = true;
    // Simulate async
    setTimeout(() => {
      works.value = getMockWorks(filters.value);
      loading.value = false;
    }, 300);
  }

  function fetchWorkById(id: string) {
    loading.value = true;
    setTimeout(() => {
      currentWork.value = getMockWorkById(id) ?? null;
      loading.value = false;
    }, 200);
  }

  function setCategory(category: string) {
    filters.value.category = category;
    fetchWorks();
  }

  function setSort(sort: VibeCoding.SortMode) {
    filters.value.sort = sort;
    fetchWorks();
  }

  function setSearch(query: string) {
    filters.value.search = query;
    fetchWorks();
  }

  function toggleLike(workId: string) {
    const work = works.value.find((w) => w.id === workId);
    if (work) {
      work.likes += 1;
    }
  }

  fetchWorks();

  return {
    works,
    filteredWorks,
    currentWork,
    categories,
    filters,
    loading,
    fetchWorks,
    fetchWorkById,
    setCategory,
    setSort,
    setSearch,
    toggleLike,
  };
});
