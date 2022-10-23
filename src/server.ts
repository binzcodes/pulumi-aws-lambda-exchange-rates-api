import { errors, isCelebrateError } from 'celebrate';
import express, { Request, Response, NextFunction } from 'express';

import router from './routes/index';

const server = express();

server.use('/', router);

server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (isCelebrateError(err)) console.warn(err);
  next(err);
});
server.use(errors());
server.use((err: Error, _: Request, res: Response) => {
  console.error(err);
  res.status(500).send({
    error: 'Internal server error',
    message: 'An unknown error ocurred',
    statusCode: 500,
  });
});

export default server;
