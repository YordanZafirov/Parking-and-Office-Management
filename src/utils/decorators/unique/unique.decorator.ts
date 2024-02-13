import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsUniqueConstraint } from './validator';

export type IsUniqueConstraintInput = {
  tableName: string;
  column: string;
};

// decorator function
export function IsUnique(
  options: IsUniqueConstraintInput,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueConstraint,
    });
  };
}
