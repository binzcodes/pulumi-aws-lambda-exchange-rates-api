import axios from 'axios';

import { OER_APP_ID } from '../../config';

export const getRates = async () => {
  try {
    const response = await axios.get(
      'https://openexchangerates.org/api/latest.json',
      {
        params: {
          app_id: OER_APP_ID,
        },
      }
    );
    return response.data.rates;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
