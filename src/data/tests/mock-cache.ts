/* eslint-disable import/export */
import { CacheStore } from '@/data/protocols/cache';
import { SavePurchases } from '@/domain/usecases';

export class CacheStoreSpy implements CacheStore {
  deletekey = '';
  insertKey = '';
  messages: Array<CacheStoreSpy.Message> = [];

  insertedItems: Array<SavePurchases.Params> = [];

  delete(key: string): void {
    this.messages.push(CacheStoreSpy.Message.delete);
    this.deletekey = key;
  }

  insert(key: string, value:any): void {
    this.messages.push(CacheStoreSpy.Message.insert);
    this.insertKey = key;
    this.insertedItems = value;
  }

  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
      this.messages.push(CacheStoreSpy.Message.delete);

      throw new Error();
    });
  }

  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
      this.messages.push(CacheStoreSpy.Message.insert);
      throw new Error();
    });
  }
}

export namespace CacheStoreSpy {
  export enum Message {
    insert, delete,
  }
}
