import { defineMock } from '@a02/alova/mock';

export default defineMock({
  '[POST]/demo/test': () => {
    return {
      code: 200,
      message: '操作成功',
      data: null,
    };
  },
});
