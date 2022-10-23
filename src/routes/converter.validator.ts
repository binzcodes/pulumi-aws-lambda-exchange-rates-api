import { celebrate, Segments, Joi } from 'celebrate';

export const validateConverter = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    currency: Joi.string().required().uppercase(),
  }),
  [Segments.BODY]: Joi.object<Record<string, string>>()
    .pattern(Joi.string().length(3).uppercase(), Joi.number().required())
    .min(1)
    .message('Payload must have at least one key'),
});
