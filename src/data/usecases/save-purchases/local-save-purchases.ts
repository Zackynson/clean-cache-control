import { CacheStore } from '@/data/protocols/cache';
import { SavePurchases } from '@/domain';

export class LocalSavePurchases implements SavePurchases {
  constructor(private readonly cacheStore: CacheStore) {
    this.cacheStore = cacheStore;
  }

  async save(value: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.delete('purchases');
    this.cacheStore.insert('purchases', value);
    return Promise.resolve();
  }
}
