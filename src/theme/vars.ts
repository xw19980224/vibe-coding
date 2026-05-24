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
    nprogress: 'rgb(var(--nprogress-color))',
  },
  shadow: {
    card: 'var(--card-box-shadow)',
  },
};
