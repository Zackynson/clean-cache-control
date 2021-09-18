import { CacheStore } from '@/data/protocols/cache';
import { SavePurchases } from '@/domain/usecases';

export class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0;
  insertCallsCount = 0;
  deletekey = '';
  insertKey = '';

  insertedItems: Array<SavePurchases.Params> = [];

  delete(key: string): void {
    this.deletekey = key;
    this.deleteCallsCount += 1;
  }

  insert(key: string, value:any): void {
    this.insertKey = key;
    this.insertCallsCount += 1;
    this.insertedItems = value;
  }

  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => { throw new Error(); });
  }

  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => { throw new Error(); });
  }
}
