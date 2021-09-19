import { PurchaseModel } from '@/domain/models';

export interface LoadPurchases {
  load: () => Promise<Array<LoadPurchases.Result>>;
}

export namespace LoadPurchases {
  export type Result = PurchaseModel;
}
