import * as cloud from '@pulumi/cloud-aws';

import server from './src/server';

const expressApp = new cloud.HttpServer('expressApp', () => server);

export const { url } = expressApp;
