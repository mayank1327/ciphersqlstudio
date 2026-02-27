const Joi = require('joi');

const executeQuerySchema = Joi.object({
  assignmentId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid assignment ID format',
      'any.required': 'Assignment ID is required'
    }),
  sqlQuery: Joi.string()
    .min(1)
    .max(2000)
    .required()
    .messages({
      'string.empty': 'SQL query cannot be empty',
      'string.max': 'Query too long — maximum 2000 characters',
      'any.required': 'SQL query is required'
    })
});

const hintSchema = Joi.object({
  assignmentId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid assignment ID format',
      'any.required': 'Assignment ID is required'
    }),
  sqlQuery: Joi.string()
    .max(2000)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Query too long — maximum 2000 characters'
    })
});

module.exports = {
  executeQuerySchema,
  hintSchema
};