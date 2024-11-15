const QueryKeys = {
  TOKENS: 'tokens',
  USER: 'user',
  USERS: 'users',
  IMAGE: 'image',
} as const;

export type QueryKeysType = typeof QueryKeys[keyof typeof QueryKeys];

export const filterEmptyKeys = (
  queryKey: Array<string | number | undefined | null>,
) => {
  return queryKey.filter((item) => item || item === 0) as Array<
    string | number
  >;
};

export default QueryKeys;
