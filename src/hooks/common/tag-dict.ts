import { useTagDictStore } from '@/stores/modules/tag-dict';
import { useLoading } from '@a02/hooks';
import { TagDictAPI } from '@/service/api/tag-dict.ts';
import { TagDictTypes } from '@/enum/tag-dict.ts';

export const useTagDict = (...args: TagDictTypes[]) => {
  const store = useTagDictStore();
  const dictObject = reactive<Record<string, string[]>>({});
  const { loading: tagLoading, endLoading } = useLoading(true);
  const promises: Promise<void>[] = [];

  args.forEach((type) => {
    dictObject[type] = [];

    const cached = store.getDict(type);

    if (cached) {
      dictObject[type] = cached;
      promises.push(Promise.resolve());
    } else {
      const promise = TagDictAPI.listByType(type).then((data) => {
        dictObject[type] = data;
        store.setDict(type, data);
      });

      promises.push(promise);
    }
  });

  Promise.all(promises).finally(() => {
    endLoading();
  });

  return {
    ...toRefs(dictObject),
    tagLoading,
  };
};
