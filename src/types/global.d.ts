export {};

declare global {
  /**
   * 扩展 Window 接口，添加 Naive UI 全局组件实例
   */
  export interface Window {
    /** NProgress 实例 */
    NProgress?: import('nprogress').NProgress;
  }

  /** 构建时间戳，由 Vite 在构建时注入 */
  export const BUILD_TIME: string;
}
