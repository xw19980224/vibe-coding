function rafThrottle<T extends (...args: unknown[]) => unknown>(fn: T) {
  let lock = false;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (lock) return;
    lock = true;
    window.requestAnimationFrame(() => {
      fn.apply(this, args);
      lock = false;
    });
  };
}

function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay = 300) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

export { rafThrottle, debounce };
