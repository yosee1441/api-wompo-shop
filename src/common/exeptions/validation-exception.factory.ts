import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export function validationExceptionFactory(
  errors: ValidationError[],
): BadRequestException {
  const result = [];

  const traverse = (node) => {
    if (node?.constraints && typeof node?.constraints === 'object') {
      if (Array.isArray(node.constraints)) {
        node.constraints.forEach((constraint) => {
          if (
            constraint?.constraints &&
            typeof constraint?.constraints === 'object'
          ) {
            for (const key in constraint.constraints) {
              result.push({
                message: constraint.constraints[key],
                code: 'UNKNOWN_ERROR',
              });
            }
          }
        });
      } else {
        for (const key in node.constraints) {
          result.push({
            message: node.constraints[key],
            code: 'UNKNOWN_ERROR',
          });
        }
      }
    }

    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(traverse);
    }
  };

  errors.forEach(traverse);

  return new BadRequestException(result.flat());
}
