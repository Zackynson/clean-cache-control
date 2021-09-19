import { CacheStore } from '@/data/protocols/cache';
import { SavePurchases, LoadPurchases } from '@/domain/usecases';

export class LocalCacheManager implements SavePurchases, LoadPurchases {
  constructor(private readonly cacheStore: CacheStore, private readonly timestamp: Date) {
    this.cacheStore = cacheStore;
    this.timestamp = timestamp;
  }

  async load() :Promise<Array<LoadPurchases.Result>> {
    try {
      this.cacheStore.load('purchases');
      return [];
    } catch (error) {
      this.cacheStore.delete('purchases');
      return [];
    }
  }

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.replace('purchases', {
      timestamp: this.timestamp,
      value: purchases,
    });
  }
}
