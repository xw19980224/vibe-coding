import { overrideThemeSettings, themeSettings } from '@/theme/setting.ts';
import { localStg } from '@/utils/storage.ts';
import defu from 'defu';
import { getColorPalette, getRgb } from '@a02/color';
import { toggleHtmlClass } from '@/utils/common.ts';
import { DARK_CLASS } from '@/constants/app.ts';
import { themeVars } from '@/theme/vars.ts';

export function initThemeSettings() {
  const isProd = import.meta.env.PROD;
  if (!isProd) return themeSettings;
  const localSettings = localStg.get('themeSettings');

  let settings = defu(localSettings, themeSettings);

  const isOverride = localStg.get('overrideThemeFlag') === BUILD_TIME;

  if (!isOverride) {
    settings = defu(overrideThemeSettings, settings);

    localStg.set('overrideThemeFlag', BUILD_TIME);
  }

  return settings;
}

/**
 * create theme token css vars value by theme settings
 *
 * @param colors Theme colors
 * @param tokens Theme setting tokens
 */
export function createThemeToken(
  colors: App.Theme.ThemeColor,
  tokens?: App.Theme.ThemeSetting['tokens'],
) {
  const paletteColors = createThemePaletteColors(colors);

  const { light, dark } = tokens || themeSettings.tokens;

  const themeTokens: App.Theme.ThemeTokenCSSVars = {
    colors: {
      ...paletteColors,
      nprogress: paletteColors.primary,
      ...light.colors,
    },
    shadow: {
      ...light.shadow,
    },
    radius: {
      ...(light as any).radius,
    },
  };

  const darkThemeTokens: App.Theme.ThemeTokenCSSVars = {
    colors: {
      ...themeTokens.colors,
      ...dark?.colors,
    },
    shadow: {
      ...themeTokens.shadow,
      ...dark?.shadow,
    },
    radius: {
      ...themeTokens.radius,
      ...((dark as any)?.radius),
    },
  };

  return {
    themeTokens,
    darkThemeTokens,
  };
}

/**
 * 创建主题调色板颜色
 *
 * @param colors 主题颜色
 */
function createThemePaletteColors(colors: App.Theme.ThemeColor) {
  const colorKeys = Object.keys(colors) as App.Theme.ThemeColorKey[];
  const colorPaletteVar = {} as App.Theme.ThemePaletteColor;

  colorKeys.forEach((key) => {
    const colorMap = getColorPalette(colors[key]);

    colorPaletteVar[key] = colorMap.get(500)!;

    colorMap.forEach((hex, number) => {
      colorPaletteVar[`${key}-${number}`] = hex;
    });
  });

  return colorPaletteVar;
}

/**
 * 根据 themeRadius 生成圆角尺度
 */
export function createRadiusTokens(themeRadius: number): App.Theme.ThemeSettingTokenRadius {
  return {
    none: '0',
    xs: `${Math.max(2, Math.round(themeRadius * 0.33))}px`,
    sm: `${Math.max(4, Math.round(themeRadius * 0.66))}px`,
    md: `${themeRadius}px`,
    lg: `${Math.round(themeRadius * 1.33)}px`,
    xl: `${themeRadius * 2}px`,
    '2xl': `${Math.round(themeRadius * 2.67)}px`,
    full: '9999px',
  };
}

/**
 * 通过令牌获取css var
 *
 * @param tokens 主题基令牌
 */
function getCssVarByTokens(tokens: App.Theme.BaseToken) {
  const styles: string[] = [];

  function removeVarPrefix(value: string) {
    return value.replace('var(', '').replace(')', '');
  }

  function removeRgbPrefix(value: string) {
    return value.replace('rgb(', '').replace(')', '');
  }

  for (const [key, tokenValues] of Object.entries(themeVars)) {
    for (const [tokenKey, tokenValue] of Object.entries(tokenValues)) {
      let cssVarsKey = removeVarPrefix(tokenValue);
      let cssValue = tokens[key][tokenKey];

      if (key === 'colors') {
        cssVarsKey = removeRgbPrefix(cssVarsKey);
        const { r, g, b } = getRgb(cssValue);
        cssValue = `${r} ${g} ${b}`;
      }

      styles.push(`${cssVarsKey}: ${cssValue}`);
    }
  }

  return styles.join(';');
}

/**
 * Add theme vars to global
 *
 * @param tokens
 * @param darkTokens
 */
export function addThemeVarsToGlobal(tokens: App.Theme.BaseToken, darkTokens: App.Theme.BaseToken) {
  const cssVarStr = getCssVarByTokens(tokens);
  const darkCssVarStr = getCssVarByTokens(darkTokens);

  const css = `
    :root {
      ${cssVarStr}
    }
  `;

  const darkCss = `
    html.${DARK_CLASS} {
      ${darkCssVarStr}
    }
  `;

  const styleId = 'theme-vars';

  const style = document.querySelector(`#${styleId}`) || document.createElement('style');

  style.id = styleId;

  style.textContent = css + darkCss;

  document.head.appendChild(style);
}

/**
 * Toggle css dark mode
 *
 * @param darkMode Is dark mode
 */
export function toggleCssDarkMode(darkMode = false) {
  const { add, remove } = toggleHtmlClass(DARK_CLASS);

  if (darkMode) {
    add();
  } else {
    remove();
  }
}
