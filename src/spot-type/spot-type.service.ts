import { Injectable } from '@nestjs/common';

@Injectable()
export class SpotTypeService {
  findAll() {
    return `This action returns all spotType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} spotType`;
  }
}
