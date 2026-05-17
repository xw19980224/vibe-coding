declare namespace App {

  namespace Theme {
    type ColorPaletteNumber = import('@a02/color').ColorPaletteNumber;

    interface ThemeSetting {
      themeScheme: UnionKey.ThemeScheme;
      /**
       * 主题颜色
       */
      themeColor: string;
      /**4
       * 其他颜色
       */
      otherColor: OtherColor;
      /**
       *  主题半径
       */
      themeRadius: number;
      /**
       * 信息色是否紧跟主色
       */
      isInfoFollowPrimary: boolean;

      tokens: {
        light: ThemeSettingToken;
        dark?: {
          [K in keyof ThemeSettingToken]?: Partial<ThemeSettingToken[K]>;
        };
      };
    }

    interface OtherColor {
      info: string;
      success: string;
      warning: string;
      error: string;
    }

    interface ThemeColor extends OtherColor {
      primary: string;
    }

    type ThemeColorKey = keyof ThemeColor;

    type ThemePaletteColor = {
      [key in ThemeColorKey | `${ThemeColorKey}-${ColorPaletteNumber}`]: string;
    };

    type BaseToken = Record<string, Record<string, string>>;

    interface ThemeSettingTokenColor {
      'base-text': string;
      nprogress?: string;
      container: string;
    }

    interface ThemeSettingTokenBoxShadow {
      card?: string;
    }

    interface ThemeSettingToken {
      colors: ThemeSettingTokenColor;
      shadow: ThemeSettingTokenBoxShadow;
    }

    type ThemeTokenColor = ThemePaletteColor & ThemeSettingTokenColor;

    type ThemeTokenCSSVars = {
      colors: ThemeTokenColor & { [key: string]: string };
      shadow: ThemeSettingTokenBoxShadow & { [key: string]: string };
    };
  }

  namespace I18n {
    type LangType = 'en-US' | 'zh-CN';

    type LangOption = {
      label: string;
      key: LangType;
    };

    type Schema = {
      common: {
        error: string;
        confirm: string;
      };
      icon: {
        themeSchema: string;
        lang: string;
      };
    };

    type GetI18nKey<
      T extends Record<string, unknown>,
      K extends keyof T = keyof T,
    > = K extends string
      ? T[K] extends Record<string, unknown>
        ? `${K}.${GetI18nKey<T[K]>}`
        : K
      : never;

    type I18nKey = GetI18nKey<Schema>;

    type TranslateOptions<Locales extends string> = import('vue-i18n').TranslateOptions<Locales>;

    interface $T {
      (key: I18nKey): string;
      (key: I18nKey, plural: number, options?: TranslateOptions<LangType>): string;
      (key: I18nKey, defaultMsg: string, options?: TranslateOptions<I18nKey>): string;
      (key: I18nKey, list: unknown[], options?: TranslateOptions<I18nKey>): string;
      (key: I18nKey, list: unknown[], plural: number): string;
      (key: I18nKey, list: unknown[], defaultMsg: string): string;
      (key: I18nKey, named: Record<string, unknown>, options?: TranslateOptions<LangType>): string;
      (key: I18nKey, named: Record<string, unknown>, plural: number): string;
      (key: I18nKey, named: Record<string, unknown>, defaultMsg: string): string;
    }
  }
}
