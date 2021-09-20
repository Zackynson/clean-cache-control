/* eslint-disable import/export */
import { CacheStore } from '@/data/protocols/cache';
import { SavePurchases } from '@/domain/usecases';

export class CacheStoreSpy implements CacheStore {
  deletekey = '';
  insertKey = '';
  loadKey = '';
  actions: Array<CacheStoreSpy.Action> = [];

  insertedItems: Array<SavePurchases.Params> = [];
  fetchResult: any;

  delete(key: string): void {
    this.actions.push(CacheStoreSpy.Action.delete);
    this.deletekey = key;
  }

  async load(key: string): Promise<any> {
    this.actions.push(CacheStoreSpy.Action.load);
    this.loadKey = key;
    return this.fetchResult;
  }

  insert(key: string, value: any): void {
    this.actions.push(CacheStoreSpy.Action.insert);
    this.insertKey = key;
    this.insertedItems = value;
  }

  replace(key: string, value: any): void {
    this.delete(key);
    this.insert(key, value);
  }

  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
      this.actions.push(CacheStoreSpy.Action.delete);

      throw new Error();
    });
  }

  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
      this.actions.push(CacheStoreSpy.Action.insert);
      throw new Error();
    });
  }

  simulateLoadError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'load').mockImplementationOnce(() => {
      this.actions.push(CacheStoreSpy.Action.load);
      throw new Error();
    });
  }
}

export namespace CacheStoreSpy {
  export enum Action {
    insert, delete, load,
  }
}
