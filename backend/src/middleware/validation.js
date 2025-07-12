import Joi from 'joi';

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message),
      });
    }
    next();
  };
};

// Validation schemas
export const schemas = {
  // Auth schemas
  register: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required(),
  }),

  // Portfolio schemas
  portfolio: Joi.object({
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string().allow(''),
    category: Joi.string().max(100),
    tags: Joi.array().items(Joi.string()),
    tech_stack: Joi.array().items(Joi.string()),
    results: Joi.array().items(Joi.string()),
    link: Joi.string().uri().allow(''),
    status: Joi.string().valid('draft', 'published'),
  }),

  // Blog schemas
  blog: Joi.object({
    title: Joi.string().min(2).max(255).required(),
    excerpt: Joi.string().allow(''),
    content: Joi.string().required(),
    author: Joi.string().max(255),
    category: Joi.string().max(100),
    tags: Joi.array().items(Joi.string()),
    read_time: Joi.number().integer().min(1),
    status: Joi.string().valid('draft', 'published'),
  }),

  // Contact schemas
  contact: Joi.object({
    first_name: Joi.string().min(2).max(255).required(),
    last_name: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().required(),
    company: Joi.string().max(255).allow(''),
    phone: Joi.string().max(50).allow(''),
    project_type: Joi.string().max(100),
    budget: Joi.string().max(100),
    message: Joi.string().required(),
  }),

  // Services schemas
  service: Joi.object({
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string().allow(''),
    features: Joi.array().items(Joi.string()),
    price_range: Joi.string().max(100),
    duration: Joi.string().max(100),
    category: Joi.string().max(100),
    status: Joi.string().valid('active', 'inactive'),
  }),

  // Labs schemas
  lab: Joi.object({
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string().allow(''),
    category: Joi.string().max(100),
    tags: Joi.array().items(Joi.string()),
    demo_url: Joi.string().uri().allow(''),
    source_url: Joi.string().uri().allow(''),
    status: Joi.string().valid('draft', 'published'),
  }),

  // Estimate schemas
  estimate: Joi.object({
    project_type: Joi.string().required(),
    features: Joi.array().items(Joi.string()).required(),
    timeline: Joi.string().required(),
    budget_range: Joi.string().required(),
    additional_requirements: Joi.string().allow(''),
  }),

  // Newsletter schema
  newsletter: Joi.object({
    email: Joi.string().email().required(),
  }),

  // Testimonial schema
  testimonial: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    role: Joi.string().max(255).allow(''),
    company: Joi.string().max(255).allow(''),
    industry: Joi.string().max(100).allow(''),
    quote: Joi.string().required(),
    full_quote: Joi.string().allow(''),
    rating: Joi.number().integer().min(1).max(5),
    project_type: Joi.string().max(100).allow(''),
    results: Joi.array().items(Joi.string()),
    status: Joi.string().valid('draft', 'published'),
  }),
};