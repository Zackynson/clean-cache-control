// eslint-disable-next-line max-classes-per-file
interface CacheStore {
  delete: () => void
}

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0;

  delete(): void {
    this.deleteCallsCount += 1;
  }
}

class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) {
    this.cacheStore = cacheStore;
  }

  async save(): Promise<void> {
    this.cacheStore.delete();
    return Promise.resolve();
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

  test('Should delete old Cache on sut.save', () => {
    const { sut, cacheStore } = makeSut();
    sut.save();
    expect(cacheStore.deleteCallsCount).toBe(1);
  });
});
