export const validationRules = {
  required: {
    validate: (value) => value !== undefined && value !== null && value !== '',
    message: 'This field is required',
  },
  email: {
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address',
  },
  phone: {
    validate: (value) => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(value),
    message: 'Please enter a valid phone number',
  },
  url: {
    validate: (value) => {
      try { new URL(value); return true; } catch { return false; }
    },
    message: 'Please enter a valid URL',
  },
  minLength: (min) => ({
    validate: (value) => value.length >= min,
    message: `Minimum length is ${min} characters`,
  }),
  maxLength: (max) => ({
    validate: (value) => value.length <= max,
    message: `Maximum length is ${max} characters`,
  }),
  min: (min) => ({
    validate: (value) => Number(value) >= min,
    message: `Value must be at least ${min}`,
  }),
  max: (max) => ({
    validate: (value) => Number(value) <= max,
    message: `Value must be at most ${max}`,
  }),
  regex: (pattern, message) => ({
    validate: (value) => new RegExp(pattern).test(value),
    message: message || 'Value does not match required pattern',
  }),
};