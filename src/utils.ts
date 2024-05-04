export function omitUndefined<T extends Record<string, any>>(obj: T): T {
  const result = {} as Record<string, any>;
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined) {
      result[key] = value;
    }
  });
  return result as T;
}
