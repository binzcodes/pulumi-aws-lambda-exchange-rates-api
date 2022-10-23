import supertest from 'supertest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import app from '../server';

const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

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
  process.env.PULUMI_CONFIG = JSON.stringify({
    'project:oerAppId': 'mock_app_id',
  });
  // Establish requests interception layer before all tests.
  server.listen();
});

afterAll(() => {
  // Clean up after all tests are done, preventing this
  // interception layer from affecting irrelevant tests.
  server.close();
});

describe('POST /converter/:targetCurrency', () => {
  afterEach(() => warn.mockReset());

  it('should convert GBP > USD', async () => {
    const res = await supertest(app).post('/USD').send({ GBP: 100 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ USD: 127.28 });
  });

  it('should convert USD > GBP', async () => {
    const res = await supertest(app).post('/GBP').send({ USD: 100 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ GBP: 78.57 });
  });

  it('should convert EUR > GBP', async () => {
    const res = await supertest(app).post('/GBP').send({ EUR: 100 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ GBP: 89.47 });
  });

  it('should convert and sum multiple currencies in a single request', async () => {
    const res = await supertest(app)
      .post('/CAD')
      .send({ EUR: 13.12, GBP: 99 })
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ CAD: 185.64 });
  });

  it('should handle lowercase currency code url params', async () => {
    const res = await supertest(app).post('/usd').send({ GBP: 100 });

    expect(res.status).toBe(200);
  });

  it('should handle lowercase currency codes in the request payload', async () => {
    const res = await supertest(app).post('/USD').send({ gbp: 100 });

    expect(res.status).toBe(200);
  });

  it('should accept both numeric and string source value', async () => {
    const res = await supertest(app).post('/USD').send({ GBP: '100' });

    expect(res.status).toBe(200);
  });

  it('should return an error if no source currency data is provided', async () => {
    const res = await supertest(app)
      .post('/CAD')
      .send({})
      .set('Accept', 'application/json');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: 'Validation failed',
      statusCode: 400,
      validation: {
        body: {
          keys: [''],
          message: 'Payload must have at least one key',
          source: 'body',
        },
      },
    });
    // expect(warn).toBeCalledWith('No data in request');
  });

  it('should return an error if the target currency is not available', async () => {
    const res = await supertest(app)
      .post('/THB')
      .send({ GBP: 100 })
      .set('Accept', 'application/json');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Currency THB not found' });
    expect(warn).toBeCalledWith('Currency THB not found');
  });

  it('should return an error if any of the source currencies are not available', async () => {
    const res = await supertest(app)
      .post('/USD')
      .send({ GBP: 100, THB: 100 })
      .set('Accept', 'application/json');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Currency THB not found' });
    expect(warn).toBeCalledWith('Currency THB not found');
  });
});
