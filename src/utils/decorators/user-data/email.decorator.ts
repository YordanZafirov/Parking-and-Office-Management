import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsYaraEmail(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isYaraEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && value.endsWith('@yara.com');
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an email address ending with "@yara.com"`;
        },
      },
    });
  };
}
