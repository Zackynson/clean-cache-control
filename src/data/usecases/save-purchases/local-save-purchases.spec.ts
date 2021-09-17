// eslint-disable-next-line max-classes-per-file

import { LocalSavePurchases } from '@/data/usecases';
import { SavePurchases } from '@/domain';
import { CacheStore } from '@/data/protocols/cache';

class CacheStoreSpy implements CacheStore {
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

const mockPurchases = (): Array<SavePurchases.Params> => [{
  id: '1',
  date: new Date(),
  value: 1,
}, {
  id: '2',
  date: new Date(),
  value: 2,
}];

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
