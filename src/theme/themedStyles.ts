import { getPaletteVersion } from './colors';

/**
 * Styles that follow the light / dark palette without an app reload.
 *
 *   const styles = themedStyles(() => StyleSheet.create({ ... }));
 *
 * `styles.row` reads from a cache built for the current palette; after a
 * theme switch the factory runs again on first access, so every
 * `colors.x` inside it picks up the new value.
 */
export const themedStyles = <T extends object>(factory: () => T): T => {
  let version = -1;
  let cache = {} as T;

  const current = () => {
    const now = getPaletteVersion();
    if (now !== version) {
      version = now;
      cache = factory();
    }
    return cache;
  };

  return new Proxy({} as T, {
    get: (_, key) => current()[key as keyof T],
    has: (_, key) => key in current(),
    ownKeys: () => Reflect.ownKeys(current()),
    getOwnPropertyDescriptor: (_, key) => {
      const descriptor = Object.getOwnPropertyDescriptor(current(), key);
      return descriptor ? { ...descriptor, configurable: true } : undefined;
    },
  });
};
