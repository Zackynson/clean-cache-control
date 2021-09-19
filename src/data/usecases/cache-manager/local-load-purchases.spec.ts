// eslint-disable-next-line max-classes-per-file

import { LocalCacheManager } from '@/data/usecases';
import { CacheStoreSpy, mockPurchases } from '@/data/tests';

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

  test('Should load cache with correct key if cache is newer than 3 days', () => {
    const nowTimestamp = new Date();
    const { sut, cacheStore } = makeSut(nowTimestamp);
    const purchases = mockPurchases();
    sut.save(purchases);

    sut.load();
    expect(cacheStore.insertedItems).toEqual({ timestamp: nowTimestamp, value: purchases });
    expect(cacheStore.actions).toContain(CacheStoreSpy.Action.load);

    expect(cacheStore.loadKey).toBe('purchases');
  });
});
