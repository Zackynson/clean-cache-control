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

  test('Should return empty list if load fails', async () => {
    const { sut, cacheStore } = makeSut();
    cacheStore.simulateLoadError();
    const purchases = await sut.load();
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.load, CacheStoreSpy.Action.delete]);
    expect(cacheStore.deletekey).toBe('purchases');
    expect(purchases).toEqual([]);
  });

  test('Should return a list if cache is newer than 3 days', async () => {
    const currentDate = new Date();
    const timestamp = new Date(currentDate);

    timestamp.setDate(timestamp.getDate() - 3); // 3 days old
    timestamp.setSeconds(timestamp.getSeconds() + 1); // creation lasting 1 second to 3 days

    const { sut, cacheStore } = makeSut(timestamp);
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    };

    const purchases = await sut.load();

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.load]);
    expect(cacheStore.loadKey).toBe('purchases');

    expect(purchases).toEqual(cacheStore.fetchResult.value);
  });

  test('Should return a list if cache is newer than 3 days', async () => {
    const currentDate = new Date();
    const timestamp = new Date(currentDate);

    timestamp.setDate(timestamp.getDate() - 3); // 3 days old
    timestamp.setSeconds(timestamp.getSeconds() - 1); // creation 1 second after 3 days

    const { sut, cacheStore } = makeSut(currentDate);
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    };

    const purchases = await sut.load();

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.load, CacheStoreSpy.Action.delete]);
    expect(cacheStore.loadKey).toBe('purchases');
    expect(cacheStore.deletekey).toBe('purchases');
    expect(purchases).toEqual([]);
  });

  test('Should return a list if cache is 3 days old', async () => {
    const currentDate = new Date();
    const timestamp = new Date(currentDate);

    timestamp.setDate(timestamp.getDate() - 3); // 3 days old

    const { sut, cacheStore } = makeSut(currentDate);
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    };

    const purchases = await sut.load();

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.load, CacheStoreSpy.Action.delete]);
    expect(cacheStore.loadKey).toBe('purchases');
    expect(cacheStore.deletekey).toBe('purchases');
    expect(purchases).toEqual([]);
  });

  test('Should return an empty list if cache is empty', async () => {
    const currentDate = new Date();

    const { sut, cacheStore } = makeSut(currentDate);
    cacheStore.fetchResult = {
      timestamp: currentDate,
      value: [],
    };

    const purchases = await sut.load();

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.load]);
    expect(cacheStore.loadKey).toBe('purchases');
    expect(purchases).toEqual([]);
  });
});
