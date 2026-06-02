import { defineStore } from 'pinia';
import { SetupStoreId } from '@/enum';

export const useDictStore = defineStore(SetupStoreId.Dict, () => {
  // 使用 Map 存储字典数据
  const dict = ref<Map<string, Api.System.DictItem[]>>(new Map());

  /**
   * 获取字典
   * @param key 字典类型
   * @returns 字典数据数组或 null
   */
  const getDict = (key: string): Api.System.DictItem[] | null => {
    if (!key) return null;
    return dict.value.get(key) || null;
  };

  /**
   * 设置字典
   * @param key 字典类型
   * @param value 字典数据数组
   */
  const setDict = (key: string, value: Api.System.DictItem[]): boolean => {
    if (!key) return false;
    try {
      dict.value.set(key, value);
      return true;
    } catch (e) {
      console.error('设置字典时发生错误:', e);
      return false;
    }
  };

  /**
   * 删除指定字典
   */
  const removeDict = (key: string): boolean => {
    if (!key) return false;
    return dict.value.delete(key);
  };

  /**
   * 清空所有字典
   */
  const cleanDict = (): void => {
    dict.value.clear();
  };

  /**
   * 根据值获取标签
   * @param keyOrData 字典类型或字典数据
   * @param value 字典值
   * @returns 对应的标签名
   */

  const getDictLabel = (
    keyOrData: string | Ref<Api.System.DictItem[]>,
    value: string | number,
  ): string => {
    let dictItem: Api.System.DictItem;
    if (typeof keyOrData === 'string') {
      const items = getDict(keyOrData);
      if (!items) {
        return '';
      }
      dictItem = items.find((item) => item.value === value);
    } else {
      dictItem = keyOrData.value.find((item: Api.System.DictItem) => item.value === value);
    }
    return dictItem?.label ?? '';
  };

  /**
   * 批量获取标签
   * @param keyOrData 字典类型或字典数据
   * @param values 字典值数组
   * @returns 对应的标签数组
   */

  const getDictLabels = (
    keyOrData: string | Ref<Api.System.DictItem[]>,
    values: (string | number)[],
  ): string[] => {
    const dictItems = ref<Api.System.DictItem[]>([]);
    if (typeof keyOrData === 'string') {
      dictItems.value = getDict(keyOrData);
    } else {
      dictItems.value = keyOrData.value;
    }
    return values
      .map((value) => {
        return getDictLabel(dictItems, value);
      })
      .filter((label): label is string => Boolean(label));
  };

  /**
   * 获取完整字典项对象
   * @param keyOrData 字典类型或字典数据
   * @param value 字典值
   * @returns 完整的字典项对象或 null
   */
  const getDictItem = (
    keyOrData: string | Api.System.DictItem[],
    value: string | number,
  ): Api.System.DictItem | null => {
    let dictItems: Api.System.DictItem[] = [];
    if (typeof keyOrData === 'string') {
      const items = getDict(keyOrData);
      if (!items) {
        return null;
      }
      dictItems = items;
    } else {
      dictItems = keyOrData;
    }

    return dictItems.find((item: Api.System.DictItem) => item.value === String(value));
  };

  /**
   * 根据标签获取值
   * @param key 字典类型
   * @param label 字典标签
   * @returns 对应的字典值
   */
  const getDictValue = (key: string, label: string): string | number | null => {
    const items = getDict(key);
    if (!items) {
      return null;
    }
    const dictItem = items.find((item) => {
      return item.label === label;
    });
    return dictItem?.value ?? null;
  };

  return {
    dict,
    getDict,
    setDict,
    getDictLabel,
    getDictLabels,
    getDictItem,
    getDictValue,
    removeDict,
    cleanDict,
  };
});
