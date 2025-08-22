import Joi from 'joi';

export const sessionValidation = Joi.object({
  signer: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required()
  }).required(),
  
  additionalSigners: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required()
    })
  ).optional(),
  
  witnesses: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      zip: Joi.string().required(),
      address: Joi.string().required(),
      state: Joi.string().required()
    })
  ).optional(),
  
  observers: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      role: Joi.string().valid('Admin','Translator','Other').required()
    }).unknown(true)
  ).optional()
});
