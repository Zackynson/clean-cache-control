// eslint-disable-next-line max-classes-per-file

import { LocalCacheManager } from '@/data/usecases';
import { CacheStoreSpy } from '@/data/tests';

type SutTypes = {
  sut: LocalCacheManager;
  cacheStore: CacheStoreSpy;
};

const makeSut = (timestamp: Date = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalCacheManager(cacheStore, timestamp);

  return {
    sut,
    cacheStore,
  };
};

describe('LocalLoadPurchases', () => {
  test('Should not delete or insert cache on sut.init', () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.actions).toEqual([]);
  });

  test('Should load cache with correct key', () => {
    const { sut, cacheStore } = makeSut();
    sut.load();
    expect(cacheStore.loadKey).toBe('purchases');
  });
});
