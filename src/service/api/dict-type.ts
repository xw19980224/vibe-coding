import { alova } from '../request';

const DICT_TYPE_API_URL = '/system/dict-type';

export const DictTypeAPI = {
  findDictTypePage(params?: Api.System.DictTypeSearchParams) {
    return alova.Get<Api.System.DictTypePage>(`${DICT_TYPE_API_URL}/page`, {
      params,
      name: 'dictTypePage',
      cacheFor: 60 * 60 * 1000,
      hitSource: ['addDictType', 'updateDictType', 'deleteDictType', 'batchDeleteDictType'],
    });
  },

  findDictTypeList() {
    return alova.Get<Api.System.DictType[]>(`${DICT_TYPE_API_URL}`, {
      name: 'dictTypeList',
      cacheFor: 60 * 60 * 1000,
      hitSource: ['addDictType', 'updateDictType', 'deleteDictType', 'batchDeleteDictType'],
    });
  },

  addDictType(data: Api.System.DictType) {
    return alova.Post<Api.System.DictType>(`${DICT_TYPE_API_URL}`, data, {
      name: 'addDictType',
    });
  },

  updateDictType(data: Api.System.DictType) {
    return alova.Put<Api.System.DictType>(`${DICT_TYPE_API_URL}`, data, {
      name: 'updateDictType',
    });
  },

  deleteDictType(id: Api.System.DictType['id']) {
    return alova.Delete<void>(`${DICT_TYPE_API_URL}/${id}`, {
      name: 'deleteDictType',
    });
  },

  batchDeleteDictType(ids: Api.System.DictType['id'][]) {
    return alova.Delete<void>(`${DICT_TYPE_API_URL}/batch`, {
      ids,
      name: 'batchDeleteDictType',
    });
  },
};
