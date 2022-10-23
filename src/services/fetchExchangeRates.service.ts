import axios from 'axios';

const config = JSON.parse(process?.env?.PULUMI_CONFIG || '{}');

const OER_APP_ID = config['project:oerAppId'] || 'default';

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
