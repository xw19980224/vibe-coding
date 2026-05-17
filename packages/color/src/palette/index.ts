import {ColorPaletteNumber} from '../types';
import {generate} from '@ant-design/colors';

/**
 *根据提供的颜色获取调色板
 *
 * @param color
 */
export function getColorPalette(color: string) {
  const colorMap = new Map<ColorPaletteNumber, string>();

  const colors = generate(color);

  const colorNumbers: ColorPaletteNumber[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  colorNumbers.forEach((number, index) => {
    colorMap.set(number, colors[index]);
  });

  return colorMap;
}

/**
 * 按数字获取调色板颜色
 *
 * @param color 提供的颜色
 * @param number 调色板编号
 */
export function getPaletteColorByNumber(color: string, number: ColorPaletteNumber) {
  const colorMap = getColorPalette(color);

  return colorMap.get(number as ColorPaletteNumber)!;
}
