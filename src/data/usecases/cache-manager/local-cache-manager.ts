import { CacheStore } from '@/data/protocols/cache';
import { SavePurchases, LoadPurchases } from '@/domain/usecases';

export class LocalCacheManager implements SavePurchases, LoadPurchases {
  constructor(private readonly cacheStore: CacheStore, private readonly currentDate: Date) {
    this.cacheStore = cacheStore;
    this.currentDate = currentDate;
  }

  async load() :Promise<Array<LoadPurchases.Result>> {
    try {
      const cache = await this.cacheStore.load('purchases');
      const maxAge = new Date(cache.timestamp);

      maxAge.setDate(maxAge.getDate() + 3);

      if (maxAge > this.currentDate) {
        return cache.value;
      }

      throw new Error();
    } catch (error) {
      this.cacheStore.delete('purchases');
      return [];
    }
  }

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.replace('purchases', {
      timestamp: this.currentDate,
      value: purchases,
    });
  }
}
