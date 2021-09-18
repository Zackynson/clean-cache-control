import faker from 'faker';
import { SavePurchases } from '@/domain/usecases';

export const mockPurchases = (): Array<SavePurchases.Params> => [{
  id: faker.datatype.uuid(),
  date: faker.date.recent(),
  value: faker.datatype.number(),
}, {
  id: faker.datatype.uuid(),
  date: faker.date.recent(),
  value: faker.datatype.number(),
}];
