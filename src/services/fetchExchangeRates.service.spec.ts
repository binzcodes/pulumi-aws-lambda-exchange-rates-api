import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { getRates } from './fetchExchangeRates.service';

const server = setupServer(
  // Describe the requests to mock.
  rest.get('https://openexchangerates.org/api/latest.json', (req, res, ctx) => {
    return res(
      ctx.json({
        disclaimer:
          'Usage subject to terms: https://openexchangerates.org/terms',
        license: 'https://openexchangerates.org/license',
        timestamp: 1647421200,
        base: 'USD',
        rates: {
          USD: '1',
          EUR: '0.87815',
          GBP: '0.78569',
          CAD: '1.31715',
          INR: '69.3492',
          MXN: '19.2316',
          AUD: '1.43534',
          CNY: '6.88191',
          MYR: '4.13785',
          COP: '3203.18',
        },
      })
    );
  })
);

beforeAll(() => {
  // Establish requests interception layer before all tests.
  server.listen();
});
afterAll(() => {
  // Clean up after all tests are done, preventing this
  // interception layer from affecting irrelevant tests.
  server.close();
});

describe('getRates', () => {
  it('should fetch the exchangeRates from the api', async () => {
    const rates = await getRates();
    expect(rates).toEqual({
      USD: '1',
      EUR: '0.87815',
      GBP: '0.78569',
      CAD: '1.31715',
      INR: '69.3492',
      MXN: '19.2316',
      AUD: '1.43534',
      CNY: '6.88191',
      MYR: '4.13785',
      COP: '3203.18',
    });
  });
});
