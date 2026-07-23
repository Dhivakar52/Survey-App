export const validators = {
  required: (value) => {
    if (value === undefined || value === null || value === '') {
      return 'This field is required';
    }
    if (Array.isArray(value) && value.length === 0) {
      return 'This field is required';
    }
    return null;
  },
  
  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },
  
  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(value)) {
      return 'Please enter a valid phone number';
    }
    return null;
  },
  
  url: (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },
  
  minLength: (min) => (value) => {
    if (!value) return null;
    if (value.length < min) {
      return `Minimum length is ${min} characters`;
    }
    return null;
  },
  
  maxLength: (max) => (value) => {
    if (!value) return null;
    if (value.length > max) {
      return `Maximum length is ${max} characters`;
    }
    return null;
  },
  
  min: (min) => (value) => {
    if (value === undefined || value === null) return null;
    if (Number(value) < min) {
      return `Value must be at least ${min}`;
    }
    return null;
  },
  
  max: (max) => (value) => {
    if (value === undefined || value === null) return null;
    if (Number(value) > max) {
      return `Value must be at most ${max}`;
    }
    return null;
  },
  
  regex: (pattern, message) => (value) => {
    if (!value) return null;
    const regex = new RegExp(pattern);
    if (!regex.test(value)) {
      return message || 'Value does not match required pattern';
    }
    return null;
  },
  
  custom: (fn, message) => (value) => {
    if (!fn(value)) {
      return message || 'Invalid value';
    }
    return null;
  },
};

export const validateField = (validatorsList, value) => {
  for (const validator of validatorsList) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};

export const validateAllFields = (fields, data) => {
  const errors = {};
  for (const [key, validatorsList] of Object.entries(fields)) {
    const error = validateField(validatorsList, data[key]);
    if (error) {
      errors[key] = error;
    }
  }
  return errors;
};