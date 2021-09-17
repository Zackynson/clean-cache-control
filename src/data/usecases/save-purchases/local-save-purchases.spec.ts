// eslint-disable-next-line max-classes-per-file

import { LocalSavePurchases } from '@/data/usecases';
import { CacheStore } from '@/data/protocols/cache';

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0;

  insertCallsCount = 0;

  deletekey = '';

  insertKey = '';

  delete(key: string): void {
    this.deletekey = key;
    this.deleteCallsCount += 1;
  }

  insert(key: string): void {
    this.insertKey = key;
    this.insertCallsCount += 1;
  }
}

type SutTypes = {
  sut: LocalSavePurchases;
  cacheStore: CacheStoreSpy;
};

const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalSavePurchases(cacheStore);

  return {
    sut,
    cacheStore,
  };
};

describe('LocalSavePurchases', () => {
  test('Should not delete cache on sut.init', () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.deleteCallsCount).toBe(0);
  });

  test('Should delete old Cache on sut.save with correct key', async () => {
    const { sut, cacheStore } = makeSut();
    await sut.save('purchases');
    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.deletekey).toBe('purchases');
  });

  test('Should not insert if delete fails', () => {
    const { sut, cacheStore } = makeSut();

    jest.spyOn(cacheStore, 'delete').mockImplementationOnce(() => { throw new Error(); });
    const promise = sut.save('purchases');
    expect(cacheStore.deleteCallsCount).toBe(0);
    expect(promise).rejects.toThrow();
  });

  test('Should insert if delete succeeds', async () => {
    const { sut, cacheStore } = makeSut();

    sut.save('purchases');
    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.deletekey).toBe('purchases');

    expect(cacheStore.insertCallsCount).toBe(1);
    expect(cacheStore.insertKey).toBe('purchases');
  });
});
