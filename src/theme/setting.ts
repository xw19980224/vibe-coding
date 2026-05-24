/**
 * 默认主题设置
 */
export const themeSettings: App.Theme.ThemeSetting = {
  themeScheme: 'light',
  themeColor: '#316c72',
  otherColor: {
    info: '#2080f0',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
  },
  themeRadius: 6,
  isInfoFollowPrimary: true,
  tokens: {
    light: {
      colors: {
        'base-text': 'rgb(31, 31, 31)',
      },
      shadow: {
        card: '0 1px 2px rgb(0, 21, 41, 0.08)',
      },
    },
    dark: {
      colors: {
        'base-text': 'rgb(224, 224, 224)',
      },
    },
  },
};
/**
 * 覆盖主题设置
 */
export const overrideThemeSettings: Partial<App.Theme.ThemeSetting> = {};
