// eslint-disable-next-line max-classes-per-file

import { LocalSavePurchases } from '@/data/usecases';
import { CacheStore } from '@/data/protocols/cache';

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0;

  key = '';

  delete(key: string): void {
    this.key = key;
    this.deleteCallsCount += 1;
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

  test('Should delete old Cache on sut.save with correct key', () => {
    const { sut, cacheStore } = makeSut();
    sut.save('purchases');
    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.key).toBe('purchases');
  });
});
