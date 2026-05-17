import {AnyColor, colord} from "colord";

export function getRgb(color: AnyColor) {
  return colord(color).toRgb();
}

/**
 * Add color alpha
 *
 * @param color - Color
 * @param alpha - Alpha (0 - 1)
 */
export function addColorAlpha(color: AnyColor, alpha: number) {
  return colord(color).alpha(alpha).toHex();
}
