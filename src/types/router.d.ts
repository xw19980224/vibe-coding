import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    title: string;
    i18nKey?: App.I18n.I18nKey | null;
    roles?: string[];
  }
}
