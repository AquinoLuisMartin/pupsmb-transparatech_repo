import Joi from 'joi';

// Common validation patterns
export const commonValidation = {
  id: Joi.number().integer().positive(),
  email: Joi.string().email().lowercase().trim(),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]')),
  name: Joi.string().trim().min(2).max(100),
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/),
  date: Joi.date().iso(),
  url: Joi.string().uri()
};

// User validation schemas
export const userSchemas = {
  register: Joi.object({
    firstName: commonValidation.name.required(),
    lastName: commonValidation.name.required(),
    email: commonValidation.email.required(),
    password: commonValidation.password.required(),
    phone: commonValidation.phone.optional(),
    role: Joi.string().valid('student', 'admin', 'officer', 'auditor', 'viewer').default('student')
  }),

  login: Joi.object({
    email: commonValidation.email.required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    firstName: commonValidation.name.optional(),
    lastName: commonValidation.name.optional(),
    phone: commonValidation.phone.optional(),
    bio: Joi.string().max(500).optional()
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: commonValidation.password.required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
  })
};

// Organization validation schemas
export const organizationSchemas = {
  create: Joi.object({
    name: Joi.string().trim().min(2).max(200).required(),
    description: Joi.string().max(1000).optional(),
    type: Joi.string().valid('academic', 'cultural', 'sports', 'service', 'special').required(),
    established: commonValidation.date.optional(),
    contactEmail: commonValidation.email.optional(),
    website: commonValidation.url.optional()
  }),

  update: Joi.object({
    name: Joi.string().trim().min(2).max(200).optional(),
    description: Joi.string().max(1000).optional(),
    type: Joi.string().valid('academic', 'cultural', 'sports', 'service', 'special').optional(),
    established: commonValidation.date.optional(),
    contactEmail: commonValidation.email.optional(),
    website: commonValidation.url.optional(),
    isActive: Joi.boolean().optional()
  })
};

// Report validation schemas
export const reportSchemas = {
  create: Joi.object({
    title: Joi.string().trim().min(5).max(200).required(),
    description: Joi.string().max(2000).optional(),
    type: Joi.string().valid('financial', 'activity', 'compliance', 'other').required(),
    organizationId: commonValidation.id.required(),
    reportPeriod: Joi.object({
      startDate: commonValidation.date.required(),
      endDate: commonValidation.date.min(Joi.ref('startDate')).required()
    }).required(),
    data: Joi.object().optional(),
    attachments: Joi.array().items(Joi.string()).optional()
  }),

  update: Joi.object({
    title: Joi.string().trim().min(5).max(200).optional(),
    description: Joi.string().max(2000).optional(),
    status: Joi.string().valid('draft', 'submitted', 'under_review', 'approved', 'rejected').optional(),
    reviewNotes: Joi.string().max(1000).optional(),
    data: Joi.object().optional()
  })
};

// Middleware function to validate request body
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    req.body = value;
    next();
  };
};

// Middleware to validate query parameters
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Query validation failed',
        details: errors
      });
    }

    req.query = value;
    next();
  };
};