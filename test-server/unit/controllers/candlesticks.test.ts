// import { queryClient } from '../../query-client';
// import indexHandler from '@/pages/api/candlesticks';
// import * as candlestickService from '@/lib-server/services/candlesticks';
// import { candlestickMock } from '../../mock/candlestick.mock';
// // import request from 'supertest';

// describe('Candlestick Controller', () => {
//   test('Get candlesticks success', async () => {
//     //  mock service
//     const mockedGetCandlestickService = jest
//       .spyOn(candlestickService, 'getCandlesticks')
//       .mockResolvedValueOnce(candlestickMock);

//     // prepare params
//     const params = {
//       page: '1',
//       limit: '10',
//       sortBy: 'lastMcap',
//       sortDirection: 'desc',
//     };
//     // act
//     const request = queryClient(indexHandler, params);
//     const { statusCode, body } = await request
//       .get('/api/candlesticks')
//       .set('Content-Type', 'application/json')
//       .set('Accept', 'application/json');

//     // assert http response
//     expect(statusCode).toBe(200);

//     expect(body).toEqual(candlestickMock);

//     // assert service input args
//     expect(mockedGetCandlestickService).toHaveBeenCalledWith({
//       page: 1,
//       limit: 10,
//       sortBy: 'lastMcap',
//       sortDirection: 'desc',
//     });

//     // clean up mocks
//     mockedGetCandlestickService.mockRestore();
//   });

//   // test limit param too big
//   test('Get candlesticks failed with limit param too big', async () => {
//     //  mock service
//     const mockedGetCandlestickService = jest
//       .spyOn(candlestickService, 'getCandlesticks')
//       .mockResolvedValueOnce(candlestickMock);

//     // prepare params
//     const params = {
//       page: '1',
//       limit: '200',
//       sortBy: 'lastMcap',
//       sortDirection: 'desc',
//     };
//     // act
//     const request = queryClient(indexHandler, params);
//     const { statusCode, body } = await request
//       .get('/api/candlesticks')
//       .set('Content-Type', 'application/json')
//       .set('Accept', 'application/json');

//     // assert http response
//     expect(statusCode).toBe(400);

//     expect(body.name).toContain('ZodError');
//     expect(body.issues[0].message).toContain(
//       'Number must be less than or equal to 100',
//     );

//     // clean up mocks
//     mockedGetCandlestickService.mockRestore();
//   });

//   // test limit param too small
//   test('Get candlesticks failed with limit param too small', async () => {
//     //  mock service
//     const mockedGetCandlestickService = jest
//       .spyOn(candlestickService, 'getCandlesticks')
//       .mockResolvedValueOnce(candlestickMock);

//     // prepare params
//     const params = {
//       page: '1',
//       limit: '-200',
//       sortBy: 'lastMcap',
//       sortDirection: 'desc',
//     };
//     // act
//     const request = queryClient(indexHandler, params);
//     const { statusCode, body } = await request
//       .get('/api/candlesticks')
//       .set('Content-Type', 'application/json')
//       .set('Accept', 'application/json');

//     // assert http response
//     expect(statusCode).toBe(400);

//     expect(body.name).toContain('ZodError');
//     expect(body.issues[0].message).toContain(
//       'Number must be greater than or equal to 1',
//     );

//     // clean up mocks
//     mockedGetCandlestickService.mockRestore();
//   });
// });
