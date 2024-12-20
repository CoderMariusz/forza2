export interface PO {
  _id?: string;
  PoNumber: string;
  supplier: { _ref: string; _type: string; name?: string };
  deliveryDate: string;
  items: {
    item: { _ref: string; _type: string; name?: string };
    quantity: number;
    status?: string;
    deliveryDateItem?: string;
  }[];
  addBy: string;
  createdAt: string;
  status:
    | 'Open order'
    | 'Draft'
    | 'Submitted'
    | 'Approved'
    | 'Rejected'
    | 'Completed'
    | 'Cancelled'
    | 'Invoiced';
}
