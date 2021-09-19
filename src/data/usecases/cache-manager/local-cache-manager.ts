import { CacheStore } from '@/data/protocols/cache';
import { SavePurchases } from '@/domain/usecases';

export class LocalCacheManager implements SavePurchases {
  constructor(private readonly cacheStore: CacheStore, private readonly timestamp: Date) {
    this.cacheStore = cacheStore;
    this.timestamp = timestamp;
  }

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.replace('purchases', {
      timestamp: this.timestamp,
      value: purchases,
    });
  }

  async load(): Promise<void> {
    this.cacheStore.load('purchases');
  }
}
