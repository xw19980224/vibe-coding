import { viteMockServe } from 'vite-plugin-mock';

export function setupMockjs(viteEnv: Env.ImportMeta) {
  const { VITE_USE_MOCK } = viteEnv;
  const enableMock = VITE_USE_MOCK === 'Y';

  return viteMockServe({
    mockPath: 'src/mock', // mock 文件目录（相对于项目根目录）
    enable: enableMock, // 是否启用 mock
    logger: enableMock, // 是否在控制台显示请求日志
    watchFiles: enableMock, // 是否监听 mock 文件变化
  });
}
