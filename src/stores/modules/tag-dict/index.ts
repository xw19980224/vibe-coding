import { defineStore } from 'pinia';
import { SetupStoreId } from '@/enum';

export const useTagDictStore = defineStore(SetupStoreId.TagDict, () => {
  const dict = ref<Map<string, string[]>>(new Map());

  const getDict = (key: string): string[] | null => {
    if (!key) return null;
    return dict.value.get(key) || null;
  };

  const setDict = (key: string, value: string[]): boolean => {
    if (!key) return false;
    try {
      dict.value.set(key, value);
      return true;
    } catch (e) {
      console.error('设置标签字典时发生错误:', e);
      return false;
    }
  };

  const removeDict = (key: string): boolean => {
    if (!key) return false;
    return dict.value.delete(key);
  };

  const cleanDict = (): void => {
    dict.value.clear();
  };

  return {
    dict,
    getDict,
    setDict,
    removeDict,
    cleanDict,
  };
});
