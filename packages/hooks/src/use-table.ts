import type { VNodeChild } from 'vue';
import useLoading from './use-loading';
import useBoolean from './use-boolean';

export interface PaginationData<T> {
  records: T[];
  pageNumber: number;
  pageSize: number;
  totalRow: number;
  totalPage: number;
}

type GetApiData<ApiData, Pagination extends boolean> = Pagination extends true
  ? PaginationData<ApiData>
  : ApiData[];

type Transform<ResponseData, ApiData, Pagination extends boolean> = (
  response: ResponseData,
) => GetApiData<ApiData, Pagination>;

export type TableColumnCheckTitle = string | ((...args: any) => VNodeChild);

export type TableColumnCheck = {
  prop: string;
  label: TableColumnCheckTitle;
  checked: boolean;
  visible: boolean;
};

export interface UseTableOptions<ResponseData, ApiData, Column, Pagination extends boolean> {
  /**
   * 获取表数据的API函数
   */
  api: () => Promise<ResponseData>;
  /**
   *  API 参数
   */
  pagination?: Pagination;
  /**
   * 将API响应转换为表数据的函数
   */
  transform: Transform<ResponseData, ApiData, Pagination>;
  /**
   * 列工厂
   */
  columns: () => Column[];
  /**
   * 获取列检查项
   * @param columns
   */
  getColumnChecks: (columns: Column[]) => TableColumnCheck[];
  /**
   * 获取列
   * @param columns
   * @param checks
   */
  getColumns: (columns: Column[], checks: TableColumnCheck[]) => Column[];
  /**
   * 获取响应时的回调
   */
  onFetched?: (data: GetApiData<ApiData, Pagination>) => void | Promise<void>;
  /**
   * 是否立即获取数据
   *
   * @default true
   */
  immediate?: boolean;
}

export default function useTable<ResponseData, ApiData, Column, Pagination extends boolean>(
  config: UseTableOptions<ResponseData, ApiData, Column, Pagination>,
) {
  const { loading, startLoading, endLoading } = useLoading();
  const { bool: empty, setBool: setEmpty } = useBoolean();

  const {
    api,
    pagination,
    transform,
    columns,
    getColumnChecks,
    getColumns,
    onFetched,
    immediate = true,
  } = config;

  const data = ref([]) as Ref<ApiData[]>;

  const columnChecks = ref(getColumnChecks(columns())) as Ref<TableColumnCheck[]>;

  const $columns = computed(() => getColumns(columns(), columnChecks.value));

  function reloadColumns() {
    const checkMap = new Map(columnChecks.value.map((col) => [col.prop, col.checked]));

    const defaultChecks = getColumnChecks(columns());

    columnChecks.value = defaultChecks.map((col) => ({
      ...col,
      checked: checkMap.get(col.prop) ?? col.checked,
    }));
  }

  async function getData() {
    try {
      startLoading();
      const response = await api();
      const transformed = transform(response);
      data.value = getTableData(transformed, pagination);
      setEmpty(data.value.length === 0);
      await onFetched?.(transformed);
    } finally {
      endLoading();
    }
  }

  if (immediate) {
    getData();
  }

  return {
    loading,
    empty,
    data,
    columns: $columns,
    columnChecks,
    reloadColumns,
    getData,
  };
}

function getTableData<ApiData, Pagination extends boolean>(
  data: GetApiData<ApiData, Pagination>,
  pagination?: Pagination,
) {
  if (pagination) {
    return (data as PaginationData<ApiData>).records;
  }

  return data as ApiData[];
}
