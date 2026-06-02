import { alova } from '../request';

const DICT_DATA_API_URL = '/system/dict-data';

export const DictDataAPI = {
  findDictDataListByDictType(dictType: string) {
    return alova.Get<Api.System.DictData[]>(`${DICT_DATA_API_URL}/${dictType}`, {
      name: 'dictDataListByDictType',
      cacheFor: 60 * 60 * 1000,
      hitSource: ['addDictData', 'updateDictData', 'deleteDictData', 'batchDeleteDictData'],
    });
  },

  findDictDataPage(params?: Api.System.DictDataSearchParams) {
    return alova.Get<Api.System.DictDataPage>(`${DICT_DATA_API_URL}/page`, {
      params,
      name: 'dictDataPage',
      cacheFor: 60 * 60 * 1000,
      hitSource: ['addDictData', 'updateDictData', 'deleteDictData', 'batchDeleteDictData'],
    });
  },

  addDictData(data: Api.System.DictData) {
    return alova.Post<Api.System.DictData>(`${DICT_DATA_API_URL}`, data, {
      name: 'addDictData',
    });
  },

  updateDictData(data: Api.System.DictData) {
    return alova.Put<Api.System.DictData>(`${DICT_DATA_API_URL}`, data, {
      name: 'updateDictData',
    });
  },

  deleteDictData(id: Api.System.DictData['id']) {
    return alova.Delete<void>(`${DICT_DATA_API_URL}/${id}`, {
      name: 'deleteDictData',
    });
  },

  batchDeleteDictData(ids: Api.System.DictData['id'][]) {
    return alova.Delete<void>(`${DICT_DATA_API_URL}/batch`, {
      ids,
      name: 'batchDeleteDictData',
    });
  },
};
