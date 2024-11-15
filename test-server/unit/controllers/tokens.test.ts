import { queryClient } from '../../query-client';
import indexHandler from '@/pages/api/tokens';
import * as tokenService from '@/lib-server/services/tokens';
import { tokensMock } from '../../mock/token.mock';
import exp from 'constants';
import { sortBy } from 'lodash';
// import request from 'supertest';

describe('Tokens Controller', () => {
  test('Get token success', async () => {
    //  mock service
    const mockedGetTokensService = jest
      .spyOn(tokenService, 'getTokens')
      .mockResolvedValueOnce(tokensMock);

    // prepare params
    const params = {
      page: '1',
      limit: '10',
      sortBy: 'lastMcap',
      sortDirection: 'desc',
    };
    // act
    const request = queryClient(indexHandler, params);
    const { statusCode, body } = await request
      .get('/api/tokens')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    // assert http response
    expect(statusCode).toBe(200);

    expect(body).toEqual(tokensMock);

    // assert service input args
    expect(mockedGetTokensService).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      sortBy: 'lastMcap',
      sortDirection: 'desc',
    });

    // clean up mocks
    mockedGetTokensService.mockRestore();
  });

  // test limit param too big
  test('Get token failed with limit param too big', async () => {
    //  mock service
    const mockedGetTokensService = jest
      .spyOn(tokenService, 'getTokens')
      .mockResolvedValueOnce(tokensMock);

    // prepare params
    const params = {
      page: '1',
      limit: '200',
      sortBy: 'lastMcap',
      sortDirection: 'desc',
    };
    // act
    const request = queryClient(indexHandler, params);
    const { statusCode, body } = await request
      .get('/api/tokens')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    // assert http response
    expect(statusCode).toBe(400);

    expect(body.name).toContain('ZodError');
    expect(body.issues[0].message).toContain(
      'Number must be less than or equal to 100',
    );

    // clean up mocks
    mockedGetTokensService.mockRestore();
  });

  // test limit param too small
  test('Get token failed with limit param too small', async () => {
    //  mock service
    const mockedGetTokensService = jest
      .spyOn(tokenService, 'getTokens')
      .mockResolvedValueOnce(tokensMock);

    // prepare params
    const params = {
      page: '1',
      limit: '-200',
      sortBy: 'lastMcap',
      sortDirection: 'desc',
    };
    // act
    const request = queryClient(indexHandler, params);
    const { statusCode, body } = await request
      .get('/api/tokens')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    // assert http response
    expect(statusCode).toBe(400);

    expect(body.name).toContain('ZodError');
    expect(body.issues[0].message).toContain(
      'Number must be greater than or equal to 1',
    );

    // clean up mocks
    mockedGetTokensService.mockRestore();
  });
});
