import { defineStore } from 'pinia';
import { SetupStoreId } from '@/enum';
import { usePreferredColorScheme } from '@vueuse/core';
import {
  addThemeVarsToGlobal,
  createThemeToken,
  initThemeSettings,
  toggleCssDarkMode,
} from '@/stores/modules/theme/shared.ts';
import { localStg } from '@/utils/storage.ts';

export const useThemeStore = defineStore(SetupStoreId.Theme, () => {
  const scope = effectScope();
  const osTheme = usePreferredColorScheme();

  /**
   * 主题设置
   */
  const settings: Ref<App.Theme.ThemeSetting> = ref(initThemeSettings());
  /**
   * Dark 模式
   */
  const darkMode = computed(() => {
    if (settings.value.themeScheme === 'auto') {
      return osTheme.value === 'dark';
    }
    return settings.value.themeScheme === 'dark';
  });

  /**
   * 主题颜色
   */
  const themeColors = computed(() => {
    const { themeColor, otherColor, isInfoFollowPrimary } = settings.value;
    const colors: App.Theme.ThemeColor = {
      primary: themeColor,
      ...otherColor,
      info: isInfoFollowPrimary ? themeColor : otherColor.info,
    };
    return colors;
  });

  /** 重置Store */
  function resetStore() {
    const themeStore = useThemeStore();

    themeStore.$reset();
  }

  /**
   * 设定主题方案
   *
   * @param themeScheme
   */
  function setThemeScheme(themeScheme: UnionKey.ThemeScheme) {
    settings.value.themeScheme = themeScheme;
  }

  /**
   * 切换主题方案
   */
  function toggleThemeScheme() {
    const themeSchemes: UnionKey.ThemeScheme[] = ['light', 'dark', 'auto'];

    const index = themeSchemes.findIndex((item) => item === settings.value.themeScheme);

    const nextIndex = index === themeSchemes.length - 1 ? 0 : index + 1;

    const nextThemeScheme = themeSchemes[nextIndex];

    setThemeScheme(nextThemeScheme);
  }

  /**
   * 更新主题颜色
   *
   * @param key Theme color key
   * @param color Theme color
   */
  function updateThemeColors(key: App.Theme.ThemeColorKey, color: string) {
    if (key === 'primary') {
      settings.value.themeColor = color;
    } else {
      settings.value.otherColor[key] = color;
    }
  }

  /**
   * 设置主题变量为全局
   */
  function setupThemeVarsToGlobal() {
    const { themeTokens, darkThemeTokens } = createThemeToken(
      themeColors.value,
      settings.value.tokens,
    );
    addThemeVarsToGlobal(themeTokens, darkThemeTokens);
  }

  // watch store
  scope.run(() => {
    // watch dark mode
    watch(
      darkMode,
      (val) => {
        toggleCssDarkMode(val);
        localStg.set('darkMode', val);
      },
      { immediate: true },
    );
    // themeColors change, update css vars and storage theme color
    watch(
      themeColors,
      (val) => {
        setupThemeVarsToGlobal();
        localStg.set('themeColor', val.primary);
      },
      { immediate: true },
    );
  });
  return {
    ...toRefs(settings.value),
    darkMode,
    themeColors,
    resetStore,
    setThemeScheme,
    toggleThemeScheme,
    updateThemeColors,
  };
});
