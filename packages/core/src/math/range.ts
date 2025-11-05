export function rangeEnd(start: number, end: number, step = 1) {
  if (step === 0) {
    return [];
  }

  const length = Math.ceil((end - start + 1) / step);
  return Array.from({ length }, (_, index) => start + step * index);
}

export function rangeAmount(start: number, length: number, step = 1) {
  if (step === 0) {
    return [];
  }

  return Array.from({ length }, (_, i) => start + i * step);
}
