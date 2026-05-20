export const SUCCESS_CODE = 200;

export function wrapData<T>(data: T) {
  return {
    code: SUCCESS_CODE,
    message: 'success',
    data,
  };
}
