// types/supplier.ts
export interface Item {
  _id?: string;
  name: string;
  price: number;
  measureUnit: string;
  expirationMethod: string;
  supplier: string;
}
