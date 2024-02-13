import { Injectable } from '@nestjs/common';

@Injectable()
export class SchemaTypeService {
  findAll() {
    return `This action returns all schemaType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schemaType`;
  }
}
