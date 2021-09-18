// eslint-disable-next-line max-classes-per-file

import { LocalSavePurchases } from '@/data/usecases';
import { CacheStoreSpy, mockPurchases } from '@/data/tests';

type SutTypes = {
  sut: LocalSavePurchases;
  cacheStore: CacheStoreSpy;
};

const makeSut = (timestamp: Date = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalSavePurchases(cacheStore, timestamp);

  return {
    sut,
    cacheStore,
  };
};

describe('LocalSavePurchases', () => {
  test('Should not delete or insert cache on sut.init', () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.actions).toEqual([]);
  });

  test('Should not insert if delete fails', async () => {
    const { sut, cacheStore } = makeSut();

    cacheStore.simulateDeleteError();

    const promise = sut.save(mockPurchases());
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete]);
    await expect(promise).rejects.toThrow();
  });

  test('Should insert new cache if delete succeeds', async () => {
    const timestamp = new Date();
    const { sut, cacheStore } = makeSut(timestamp);
    const purchases = mockPurchases();

    const promise = sut.save(purchases);

    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.delete,
      CacheStoreSpy.Action.insert,
    ]);

    expect(cacheStore.deletekey).toBe('purchases');
    expect(cacheStore.insertKey).toBe('purchases');
    expect(cacheStore.insertedItems).toEqual({ timestamp, value: purchases });
    await expect(promise).resolves.toBeFalsy();
  });

  test('Should throw if insert throws', async () => {
    const { sut, cacheStore } = makeSut();

    cacheStore.simulateInsertError();

    const promise = sut.save(mockPurchases());
    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.delete,
      CacheStoreSpy.Action.insert,
    ]);

    await expect(promise).rejects.toThrow();
  });
});
