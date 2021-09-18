// eslint-disable-next-line max-classes-per-file

import { LocalSavePurchases } from '@/data/usecases';
import { CacheStoreSpy, mockPurchases } from '@/data/tests';

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
    await sut.save(mockPurchases());
    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.deletekey).toBe('purchases');
  });

  test('Should not insert if delete fails', () => {
    const { sut, cacheStore } = makeSut();

    cacheStore.simulateDeleteError();

    const promise = sut.save(mockPurchases());
    expect(cacheStore.deleteCallsCount).toBe(0);
    expect(promise).rejects.toThrow();
  });

  test('Should insert if delete succeeds', async () => {
    const { sut, cacheStore } = makeSut();
    const purchases = mockPurchases();

    sut.save(purchases);
    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.deletekey).toBe('purchases');

    expect(cacheStore.insertCallsCount).toBe(1);
    expect(cacheStore.insertKey).toBe('purchases');
    expect(cacheStore.insertedItems).toEqual(purchases);
  });

  test('Should throw if insert throws', () => {
    const { sut, cacheStore } = makeSut();

    cacheStore.simulateInsertError();

    const promise = sut.save(mockPurchases());
    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.deletekey).toBe('purchases');

    expect(cacheStore.insertCallsCount).toBe(0);
    expect(promise).rejects.toThrow();
  });
});
