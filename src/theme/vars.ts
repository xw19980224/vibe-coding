/** 创建调色板变量 */
function createColorPaletteVars() {
  const colors: App.Theme.ThemeColorKey[] = ['primary', 'info', 'success', 'warning', 'error'];
  const colorPaletteNumbers: App.Theme.ColorPaletteNumber[] = [
    50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
  ];

  const colorPaletteVar = {} as App.Theme.ThemePaletteColor;

  colors.forEach((color) => {
    colorPaletteVar[color] = `rgb(var(--${color}-color))`;
    colorPaletteNumbers.forEach((number) => {
      colorPaletteVar[`${color}-${number}`] = `rgb(var(--${color}-${number}-color))`;
    });
  });

  return colorPaletteVar;
}

const colorPaletteVars = createColorPaletteVars();

/** Theme vars */
export const themeVars: App.Theme.ThemeTokenCSSVars = {
  colors: {
    ...colorPaletteVars,
    'base-text': 'rgb(var(--base-text-color))',
    'text-primary': 'rgb(var(--text-primary-color))',
    'text-regular': 'rgb(var(--text-regular-color))',
    'text-secondary': 'rgb(var(--text-secondary-color))',
    'text-placeholder': 'rgb(var(--text-placeholder-color))',
    'text-disabled': 'rgb(var(--text-disabled-color))',
    surface: 'rgb(var(--surface-color))',
    'surface-soft': 'rgb(var(--surface-soft-color))',
    'surface-overlay': 'rgb(var(--surface-overlay-color))',
    border: 'rgb(var(--border-color))',
    'border-soft': 'rgb(var(--border-soft-color))',
    nprogress: 'rgb(var(--nprogress-color))',
  },
  shadow: {
    card: 'var(--card-box-shadow)',
    xs: 'var(--shadow-xs)',
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    xl: 'var(--shadow-xl)',
    '2xl': 'var(--shadow-2xl)',
  },
  radius: {
    none: 'var(--radius-none)',
    xs: 'var(--radius-xs)',
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    '2xl': 'var(--radius-2xl)',
    full: 'var(--radius-full)',
  },
};
