let timeoutId;
export function debounce(func, delay, ...attributes) {
  return function () {
    const context = this;
    const args = attributes.length ? [...arguments, ...attributes] : arguments;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}
