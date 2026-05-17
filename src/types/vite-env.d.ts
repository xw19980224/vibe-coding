declare namespace Env {
  interface ImportMeta extends ImportMetaEnv {
    /**
     * 应用部署的基础路径（Vite base）
     */
    readonly VITE_BASE_URL: string;
    /**
     * 应用端口
     */
    readonly VITE_APP_PORT: number;
    /**
     * API 基础路径
     */
    readonly VITE_APP_BASE_API: string;
    /**
     * 后端服务器的 URL
     */
    readonly VITE_SERVICE_BASE_URL: string;
    /**
     * 请求成功的响应码
     */
    readonly VITE_SERVICE_SUCCESS_CODE: number;
    /**
     * 图标类名前缀
     */
    readonly VITE_ICON_PREFIX: string;
    /**
     * 本地图标集合名称前缀
     */
    readonly VITE_ICON_LOCAL_PREFIX: string;
    /**
     * 是否启用 source map（"Y" | "N"）
     */
    readonly VITE_SOURCE_MAP: string;
    /**
     * Iconify API Provider URL
     *
     * 如果项目部署在内网，可以将 API Provider URL 设置为本地的 Iconify 服务器
     *
     * @link https://docs.iconify.design/api/providers.html
     */
    readonly VITE_ICONIFY_URL?: string;
    /**
     * Vue DevTools 启动编辑器配置
     */
    readonly VITE_DEVTOOLS_LAUNCH_EDITOR?: import('vite-plugin-vue-devtools').VitePluginVueDevToolsOptions['launchEditor'];
  }
}

interface ImportMeta {
  readonly env: Env.ImportMeta;
}
