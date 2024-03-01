import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const regex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{6,}$/;
          return typeof value === 'string' && regex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be at least 6 characters long and contain at least one digit, one letter, and one special symbol.`;
        },
      },
    });
  };
}
