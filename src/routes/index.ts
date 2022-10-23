import express, { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { currencyConverter } from './converter.controller';
import { validateConverter } from './converter.validator';

const router = Router();

router.use(express.json());

router.post('/:currency', validateConverter, asyncHandler(currencyConverter));

export default router;
