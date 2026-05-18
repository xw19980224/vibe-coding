import { SetupStoreId } from '@/enum';
import { breakpointsTailwind, useBreakpoints, useTitle } from '@vueuse/core';
import { $t, setLocale } from '@/locales';
import { setDayjsLocale } from '@/locales/dayjs';
import { router } from '@/router';
import { localStg } from '@/utils/storage';
import { defineStore } from 'pinia';

export const useAppStore = defineStore(SetupStoreId.App, () => {
  const scope = effectScope();
  const breakpoints = useBreakpoints(breakpointsTailwind);

  const isMobile = breakpoints.smaller('sm');

  const locale = ref<App.I18n.LangType>(localStg.get('lang') || 'zh-CN');

  const localeOptions: App.I18n.LangOption[] = [
    { label: '中文', key: 'zh-CN' },
    { label: 'English', key: 'en-US' },
  ];

  function changeLocale(lang: App.I18n.LangType) {
    locale.value = lang;
    setLocale(lang);
    localStg.set('lang', lang);
  }

  function updateDocumentTitleByLocale() {
    const { i18nKey, title } = router.currentRoute.value.meta;

    const documentTitle = i18nKey ? $t(i18nKey) : title;

    useTitle(documentTitle);
  }

  function init() {
    setDayjsLocale(locale.value);
  }

  scope.run(() => {
    watch(locale, () => {
      updateDocumentTitleByLocale();

      setDayjsLocale(locale.value);
    });
  });

  /** On scope dispose */
  onScopeDispose(() => {
    scope.stop();
  });

  // init
  init();

  return {
    breakpoints,
    isMobile,
    locale,
    localeOptions,
    changeLocale,
  };
});
