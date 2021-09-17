// eslint-disable-next-line max-classes-per-file
interface CacheStore {

}

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0;
}

class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) {
    this.cacheStore = cacheStore;
  }
}

describe('LocalSavePurchases', () => {
  test('Should not delete cache on sut.init', () => {
    const cacheStore = new CacheStoreSpy();
    new LocalSavePurchases(cacheStore);

    expect(cacheStore.deleteCallsCount).toBe(0);
  });
});
