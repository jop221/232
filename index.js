javascript 
AgeSchema.js
export default class AgeSchema {
  constructor() {
    this.isAdultCheck = false;
  }

  isValid(value) {
    return typeof value === 'number' && !Number.isNaN(value) && value >= 0 && (!this.isAdultCheck || value >= 18);
  }

  isAdult() {
    this.isAdultCheck = true;
    return this;
  }
}
EmailSchema.js
export default class EmailSchema {
  constructor() {
    this.minLength = null;
    this.maxLength = null;
    this.regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  }

  isValid(value) {
    if (typeof value !== 'string' || value === '') {
      return false;
    }

    if (!this.regex.test(value)) {
      return false;
    }

    const [localPart] = value.split('@');
    const { length } = localPart;

    if (this.minLength !== null && length < this.minLength) {
      return false;
    }
    if (this.maxLength !== null && length > this.maxLength) {
      return false;
    }

    return true;
  }

  setEmailLengthConstraint(min, max = null) {
    if (typeof min !== 'number' || (max !== null && typeof max !== 'number')) {
      throw new Error('Invalid length constraints');
    }
    if (max !== null && min > max) {
      throw new Error('Min length cannot exceed max length');
    }

    this.minLength = min;
    this.maxLength = max;
    return this;
  }
}
ObjectSchema.js
export default class ObjectSchema {
  constructor() {
    this.fields = {};
  }

  shape(schema) {
    if (typeof schema !== 'object' || schema === null) throw new Error('Schema should be a non-null object');
    this.fields = schema;
    return this;
  }

  isValid(user) {
    if (typeof user !== 'object' || user === null) return false;
    return Object.keys(user).every((key) => key in this.fields)
      && Object.entries(this.fields).every(([field, validator]) => field in user
       && validator.isValid(user[field]));
  }
}
Validator.js
import EmailSchema from './EmailSchema.js';
import AgeSchema from './AgeSchema.js';
import ObjectSchema from './ObjectSchema.js';

class Validator {
  email() {
    return new EmailSchema();
  }

  age() {
    return new AgeSchema();
  }

  user() {
    return new ObjectSchema();
  }
}

export default Validator;