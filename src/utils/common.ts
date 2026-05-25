/** 紧凑数字：>=1b → 1.0b, >=1m → 1.0m, >=1k → 1.0k */
export function formatCompact(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'b';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'm';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k';
  return String(n);
}

/**
 * 切换html类
 *
 * @param className
 */
export function toggleHtmlClass(className: string) {
  function add() {
    document.documentElement.classList.add(className);
  }

  function remove() {
    document.documentElement.classList.remove(className);
  }

  return {
    add,
    remove,
  };
}
