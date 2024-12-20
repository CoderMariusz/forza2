export interface OrderItem {
  _id?: string;
  _type: string;
  name: string;
  itemNumber: string;
  quantity?: number;
  PONumber?: string;
  status?: string;
}
