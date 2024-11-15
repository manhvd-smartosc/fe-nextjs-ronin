import { queryClient } from '../../query-client';
import indexHandler from '@/pages/api/comments';
import * as tradeService from '@/lib-server/services/comments';
import { commentsMock } from '../../mock/comment.mock';
// import request from 'supertest';

describe('Trades Controller', () => {
  test('Get trades success', async () => {
    //  mock service
    const mockedGetCommentsService = jest
      .spyOn(tradeService, 'getComments')
      .mockResolvedValueOnce(commentsMock);

    // prepare params
    const params = {
      page: '1',
      limit: '10',
      sortBy: 'createdAt',
      sortDirection: 'desc',
    };
    // act
    const request = queryClient(indexHandler, params);
    const { statusCode, body } = await request
      .get('/api/comments')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    // assert http response
    expect(statusCode).toBe(200);

    expect(body).toEqual(commentsMock);

    // assert service input args
    expect(mockedGetCommentsService).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    });

    // clean up mocks
    mockedGetCommentsService.mockRestore();
  });

  // test limit param too big
  test('Get trades failed with limit param too big', async () => {
    //  mock service
    const mockedGetCommentsService = jest
      .spyOn(tradeService, 'getComments')
      .mockResolvedValueOnce(commentsMock);

    // prepare params
    const params = {
      page: '1',
      limit: '200',
      sortBy: 'createdAt',
      sortDirection: 'desc',
    };
    // act
    const request = queryClient(indexHandler, params);
    const { statusCode, body } = await request
      .get('/api/comments')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    // assert http response
    expect(statusCode).toBe(400);

    expect(body.name).toContain('ZodError');
    expect(body.issues[0].message).toContain(
      'Number must be less than or equal to 100',
    );

    // clean up mocks
    mockedGetCommentsService.mockRestore();
  });

  // test limit param too small
  test('Get trades failed with limit param too small', async () => {
    //  mock service
    const mockedGetCommentsService = jest
      .spyOn(tradeService, 'getComments')
      .mockResolvedValueOnce(commentsMock);

    // prepare params
    const params = {
      page: '1',
      limit: '-200',
      sortBy: 'createdAt',
      sortDirection: 'desc',
    };
    // act
    const request = queryClient(indexHandler, params);
    const { statusCode, body } = await request
      .get('/api/comments')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    // assert http response
    expect(statusCode).toBe(400);

    expect(body.name).toContain('ZodError');
    expect(body.issues[0].message).toContain(
      'Number must be greater than or equal to 1',
    );

    // clean up mocks
    mockedGetCommentsService.mockRestore();
  });
});
