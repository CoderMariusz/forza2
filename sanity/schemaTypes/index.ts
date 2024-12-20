import { type SchemaTypeDefinition } from 'sanity';
import { expiredDateMethodType } from './expiredDateMethodType';
import { supplierType } from './supplierType';
import { itemType } from './itemType';
import { purchaseOrder } from './PurchaseOrderType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [expiredDateMethodType, supplierType, itemType, purchaseOrder]
};
