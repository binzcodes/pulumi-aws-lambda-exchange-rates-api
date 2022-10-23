export const convertCurrency = (
  value: number,
  sourceRate: number,
  targetRate: number
) =>
  (value * 100000) / ((sourceRate * 100000) / (targetRate * 100000)) / 100000;

export const round = (value: number) => Math.round(value * 100) / 100;

export const getRate = (currency: string, rates: { [x: string]: any }) =>
  rates[currency.toUpperCase()];

export const convertCurrencies = (
  sourceCurrencyData: any[],
  targetCurrency: string,
  rateData: any
) => {
  const result = sourceCurrencyData.reduce((acc, [sourceCurrency, value]) => {
    return (
      acc +
      convertCurrency(
        value,
        getRate(sourceCurrency, rateData),
        getRate(targetCurrency, rateData)
      )
    );
  }, 0);
  return round(result);
};
