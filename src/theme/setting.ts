/**
 * 默认主题设置
 */
export const themeSettings: App.Theme.ThemeSetting = {
  themeScheme: 'dark',
  themeColor: '#f97316',
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
        'text-primary': 'rgb(15, 23, 42)',
        'text-regular': 'rgb(51, 65, 85)',
        'text-secondary': 'rgb(100, 116, 139)',
        'text-placeholder': 'rgb(148, 163, 184)',
        'text-disabled': 'rgb(186, 199, 213)',
        surface: 'rgb(255, 255, 255)',
        'surface-soft': 'rgb(248, 250, 252)',
        'surface-overlay': 'rgb(255, 255, 255)',
        border: 'rgb(226, 232, 240)',
        'border-soft': 'rgb(241, 245, 249)',
      },
      shadow: {
        card: '0 1px 2px rgb(0, 21, 41, 0.08)',
        xs: '0 1px 2px rgb(0, 0, 0, 0.05)',
        sm: '0 1px 3px rgb(0, 0, 0, 0.1)',
        md: '0 4px 6px rgb(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgb(0, 0, 0, 0.1)',
        xl: '0 20px 25px rgb(0, 0, 0, 0.15)',
        '2xl': '0 25px 50px rgb(0, 0, 0, 0.25)',
      },
      radius: {
        none: '0',
        xs: '2px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        full: '9999px',
      },
    },
    dark: {
      colors: {
        'base-text': 'rgb(224, 224, 224)',
        'text-primary': 'rgb(241, 245, 249)',
        'text-regular': 'rgb(203, 213, 225)',
        'text-secondary': 'rgb(148, 163, 184)',
        'text-placeholder': 'rgb(100, 116, 139)',
        'text-disabled': 'rgb(71, 85, 105)',
        surface: 'rgb(15, 23, 42)',
        'surface-soft': 'rgb(30, 41, 59)',
        'surface-overlay': 'rgb(30, 41, 59)',
        border: 'rgb(51, 65, 85)',
        'border-soft': 'rgb(30, 41, 59)',
      },
      shadow: {
        xs: '0 1px 2px rgb(0, 0, 0, 0.3)',
        sm: '0 1px 3px rgb(0, 0, 0, 0.4)',
        md: '0 4px 6px rgb(0, 0, 0, 0.4)',
        lg: '0 10px 15px rgb(0, 0, 0, 0.4)',
        xl: '0 20px 25px rgb(0, 0, 0, 0.5)',
        '2xl': '0 25px 50px rgb(0, 0, 0, 0.6)',
      },
    },
  },
};
/**
 * 覆盖主题设置
 */
export const overrideThemeSettings: Partial<App.Theme.ThemeSetting> = {};
