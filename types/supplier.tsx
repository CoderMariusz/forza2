// types/supplier.ts
export interface Supplier {
  _id?: string;
  name: string;
  supplierCode: string;
  contactDetail: {
    email: string;
    phone: string;
  };
  country: string;
  taxCode: string;
}
