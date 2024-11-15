import { faker } from '@faker-js/faker';

import { PaginatedResponse } from '../../types';
import { TokensGetData, TokensResponseData } from '../../types/models/Token';

const { lorem } = faker;

const createTokenMock = (n: number): TokensResponseData[] => {
  return Array.from(Array(n).keys()).map(
    (i) =>
      ({
        id: faker.string.numeric(),
        name: lorem.sentences(2), // 2 words
        ticker: lorem.word(),
        description: lorem.paragraphs(1),
        address: faker.string.hexadecimal({ length: 42, prefix: '0x' }),
        createdBy: faker.string.hexadecimal({ length: 42, prefix: '0x' }),
        lastBuy: faker.date.recent().getTime(),
        lastComment: faker.date.recent().getTime(),
        totalComments: faker.number.int(),
        lastPrice: faker.number.float(),
        initPrice: faker.number.float(),
        initMcap: faker.number.float(),
        poolId: null,
        lastMcap: faker.number.float(),
        imageUrl: faker.image.url(),
        telegramUrl: '',
        twitterUrl: '',
        websiteUrl: '',
        createdAt: faker.date.recent().getTime(),
        transactionHash: faker.string.hexadecimal({ length: 42, prefix: '0x' }),
        transactionIndex: faker.number.int(),
        logIndex: faker.number.int(),
        blockNumber: faker.number.int(),
        User: {
          id: faker.string.hexadecimal({ length: 42, prefix: '0x' }),
          name: lorem.words(2), // 2 words
          avatarUrl: faker.image.avatar(),
          address: faker.string.hexadecimal({ length: 42, prefix: '0x' }),
          createdAt: new Date().toString(),
          bio: lorem.sentences(3),
          lastUpdatedName: new Date().toString(),
        },
      } as unknown as TokensResponseData),
  );
};

export const tokensMock: PaginatedResponse<TokensResponseData> = {
  items: createTokenMock(5),
  pagination: {
    total: 10,
    pagesCount: 2,
    currentPage: 1, // first page
    perPage: 5,
    from: 1,
    to: 5,
    hasMore: true,
  },
};
