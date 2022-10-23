import { Request, Response } from 'express';
import { getRates } from '../services/fetchExchangeRates.service';

import { convertCurrencies } from '../services/converter.service';

type AsyncController = (req: Request, res: Response) => Promise<any>;

const validateCurrency = (currency: string, rates: Record<string, string>) =>
  !!rates[currency.toUpperCase()];

export const currencyConverter: AsyncController = async (
  req: Request,
  res: Response
) => {
  const { params, body } = req;
  const currency = params.currency.toUpperCase();
  const sources = Object.entries(body);

  if (sources.length === 0) {
    console.warn('No data in request');
    return res.status(402).send({ message: 'No data in request' });
  }

  const rates = await getRates();

  if (!validateCurrency(currency, rates)) {
    console.warn(`Currency ${currency} not found`);
    return res.status(400).send({ message: `Currency ${currency} not found` });
  }

  const invalidCurrencies = sources.find(
    ([currency]) => !validateCurrency(currency, rates)
  );
  if (invalidCurrencies) {
    console.warn(`Currency ${invalidCurrencies[0]} not found`);
    return res
      .status(400)
      .send({ message: `Currency ${invalidCurrencies[0]} not found` });
  }

  const result = convertCurrencies(sources, currency, rates);
  return res.json({ [currency]: result });
};
