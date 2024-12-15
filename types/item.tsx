// types/supplier.ts
export interface Item {
  _id?: string;
  itemNumber: string;
  name: string;
  price: number;
  measureUnit: string;
  expirationMethod: {
    _ref: string;
    _id: string;
    name: string;
  };
  supplier: {
    _ref: string;
    _id: string;
    name: string;
  };
}
