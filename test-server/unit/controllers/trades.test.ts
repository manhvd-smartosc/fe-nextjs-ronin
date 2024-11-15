import { queryClient } from '../../query-client';
import indexHandler from '@/pages/api/trades';
import * as tradeService from '@/lib-server/services/trades';
import { tradesMock } from '../../mock/trade.mock';
// import request from 'supertest';

describe('Trades Controller', () => {
  test('Get trades success', async () => {
    //  mock service
    const mockedGetTradesService = jest
      .spyOn(tradeService, 'getTrades')
      .mockResolvedValueOnce(tradesMock);

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
      .get('/api/trades')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    // assert http response
    expect(statusCode).toBe(200);

    expect(body).toEqual(tradesMock);

    // assert service input args
    expect(mockedGetTradesService).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      sortBy: 'lastMcap',
      sortDirection: 'desc',
    });

    // clean up mocks
    mockedGetTradesService.mockRestore();
  });

  // test limit param too big
  test('Get trades failed with limit param too big', async () => {
    //  mock service
    const mockedGetTradesService = jest
      .spyOn(tradeService, 'getTrades')
      .mockResolvedValueOnce(tradesMock);

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
      .get('/api/trades')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    // assert http response
    expect(statusCode).toBe(400);

    expect(body.name).toContain('ZodError');
    expect(body.issues[0].message).toContain(
      'Number must be less than or equal to 100',
    );

    // clean up mocks
    mockedGetTradesService.mockRestore();
  });

  // test limit param too small
  test('Get trades failed with limit param too small', async () => {
    //  mock service
    const mockedGetTradesService = jest
      .spyOn(tradeService, 'getTrades')
      .mockResolvedValueOnce(tradesMock);

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
      .get('/api/trades')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    // assert http response
    expect(statusCode).toBe(400);

    expect(body.name).toContain('ZodError');
    expect(body.issues[0].message).toContain(
      'Number must be greater than or equal to 1',
    );

    // clean up mocks
    mockedGetTradesService.mockRestore();
  });
});
