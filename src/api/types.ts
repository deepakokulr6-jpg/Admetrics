/** Types shared across API modules. Module-specific DTOs live in the module. */

export type AuthTokens = { accessToken: string; refreshToken?: string };

/** Backend list paging: `?take=20&skip=0`. */
export type PageParams = { take?: number; skip?: number };

/** Query string values; undefined / null entries are left out. */
export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;
