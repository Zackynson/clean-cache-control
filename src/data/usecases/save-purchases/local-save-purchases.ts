import { CacheStore } from '@/data/protocols/cache';

export class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) {
    this.cacheStore = cacheStore;
  }

  async save(key: string): Promise<void> {
    this.cacheStore.delete(key);
    this.cacheStore.insert(key);
    return Promise.resolve();
  }
}
