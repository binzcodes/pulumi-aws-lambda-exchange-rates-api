import { convertCurrency } from './converter.service';

describe('convertCurrency', () => {
  it('should convert a value based on provided current and target rates against the dollar', () => {
    expect(convertCurrency(100, 1, 1.5)).toBe(150);
  });
});
