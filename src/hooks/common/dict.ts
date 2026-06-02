// useDict 内部实现逻辑
import { useDictStore } from '@/stores/modules/dict';
import { useLoading } from '@a02/hooks';
import { DictDataAPI } from '@/service/api/dict-data.ts';

export const useDict = (...args: string[]): Api.System.DataResult => {
  const dictStore = useDictStore();
  const dictObject = reactive<Record<string, Api.System.DictItem[]>>({});
  const { loading: dictLoading, endLoading } = useLoading(true);
  const promises: Promise<void>[] = [];

  args.forEach((dictType) => {
    // 初始化为空数组
    dictObject[dictType] = [];

    // 尝试从缓存获取
    const cachedDict = dictStore.getDict(dictType);

    if (cachedDict) {
      // 缓存命中，直接使用
      dictObject[dictType] = cachedDict;
      promises.push(Promise.resolve());
    } else {
      // 缓存未命中，从 API 获取
      const promise = DictDataAPI.findDictDataListByDictType(dictType).then((data) => {
        const dictData = data.map(
          (p): Api.System.DictItem => ({
            label: p.dictLabel,
            value: p.dictValue,
            status: p.status,
            elTagType: p.listClass as Api.System.ElTagType,
            elTagClass: p.cssClass,
          }),
        );

        // 更新响应式对象
        dictObject[dictType] = dictData;
        // 存入缓存
        dictStore.setDict(dictType, dictData);
      });

      promises.push(promise);
    }
  });

  // 所有请求完成后更新加载状态
  Promise.all(promises).finally(() => {
    endLoading();
  });

  return {
    ...toRefs(dictObject),
    dictLoading,
  } as Api.System.DataResult;
};
