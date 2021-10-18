interface IValidatable {
  value: string | number,
  required?: boolean,
  minLength?: number,
  maxLength?: number,
  minValue?: number,
  maxValue?: number,
}

export default IValidatable;
