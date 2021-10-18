import IValidatable from '../interfaces/validation';

const isValid = (input: IValidatable): boolean => {
  let isOk = true;
  if (input.required) {
    isOk = isOk && input.value.toString().trim().length !== 0;
  }
  if (input.minLength != null && typeof input.value === 'string') {
    isOk = isOk && input.value.length >= input.minLength;
  }
  if (input.maxLength != null && typeof input.value === 'string') {
    isOk = isOk && input.value.length <= input.maxLength;
  }
  if (input.minValue != null && typeof input.value === 'number') {
    isOk = isOk && input.value >= input.minValue;
  }
  if (input.maxValue != null && typeof input.value === 'number') {
    isOk = isOk && input.value <= input.maxValue;
  }
  return isOk;
};

export default isValid;
