import { createClient } from 'next-sanity';
import { Supplier } from '@/types/supplier';
import { PO } from '@/types/PurchaseOrder';

import { apiVersion, dataset, projectId } from '../env';
import { authToken } from '../env';
import { Item } from '@/types/item';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: authToken,
  useCdn: false // Set to false if statically generating pages, using ISR or tag-based revalidation
});
export const getItems = async (): Promise<Item[]> => {
  let data = await client.fetch(`*[_type == "item"]`);
  const supplier = await client.fetch(`*[_type == "supplier"]`);
  const expirationMethods = await client.fetch(
    `*[_type == "expiredDateMethod"]`
  );
  data = data.map((item: Item) => {
    const supplierData = supplier.find(
      (s: Supplier) => s._id === item.supplier._ref
    );
    return {
      ...item,
      supplier: supplierData
    };
  });
  data = data.map((item: Item) => {
    const expirationMethodData = expirationMethods.find(
      (e: Supplier) => e._id === item.expirationMethod._ref
    );
    return {
      ...item,
      expirationMethod: expirationMethodData
    };
  });
  console.log(data);

  return data;
};

export const getSuppliers = async (): Promise<Supplier[]> => {
  const data = await client.fetch(`*[_type == "supplier"]`);

  return data;
};

export const getExpirationMethods = async (): Promise<Supplier[]> => {
  const data = await client.fetch(`*[_type == "expiredDateMethod"]`);

  return data;
};

export const getPOs = async (): Promise<PO[]> => {
  const data = await client.fetch(`*[_type == "po"]`);
  const suppliers = await getSuppliers();
  data.forEach((po: PO) => {
    const supplier = suppliers.find(
      (s: Supplier) => s._id === po.supplier._ref
    );
    if (supplier) {
      po.supplier._ref = supplier._id as string;
      po.supplier.name = supplier.name;
      po.supplier._type = 'reference';
    }
  });
  return data;
};

export const getPOById = async (id: string): Promise<PO> => {
  const data = await client.fetch(`*[_type == "po" && _id == $id]`, {
    id
  });
  return data[0];
};

export const getItemById = async (id: string): Promise<Item> => {
  const data = await client.fetch(`*[_type == "item" && _id == $id]`, {
    id
  });
  return data[0];
};

export const saveSupplier = async (supplier: Supplier): Promise<Supplier> => {
  if (supplier._id) {
    // Update existing supplier
    const updatedSupplier = await client
      .patch(supplier._id)
      .set(supplier)
      .commit();
    return updatedSupplier as unknown as Supplier;
  } else {
    // Create new supplier
    const newSupplier = await client.create({
      _type: 'supplier',
      ...supplier
    });
    return newSupplier;
  }
};

export const saveItem = async (item: Item): Promise<Item> => {
  if (item._id) {
    // Update existing item
    const updatedItem = await client
      .patch(item._id) // Use the item's `_id` to update
      .set(item) // Update fields
      .commit(); // Commit the changes
    return updatedItem as unknown as Item;
  } else {
    // Create new item
    console.log(item);

    const newItem = await client.create({
      _type: 'item', // Define the type as 'item'
      ...item // Spread the item fields
    });
    return newItem;
  }
};

export const savePO = async (po: PO): Promise<PO> => {
  const formattedItems = po.items.map((poItem) => ({
    item: {
      _ref: poItem.item._ref as string,
      _type: 'reference'
    },
    quantity: poItem.quantity,
    status: poItem.status || 'Open', // Default to 'Open' if not provided
    deliveryDateItem: poItem.deliveryDateItem || po.deliveryDate // Use PO delivery date as fallback
  }));

  if (po._id) {
    // Update existing PO
    const updatedPO = await client
      .patch(po._id) // Use the PO's `_id` to update
      .set({
        ...po,
        items: formattedItems // Update with formatted items
      })
      .commit(); // Commit the changes
    return updatedPO as unknown as PO;
  } else {
    // Create new PO
    const newPO = await client.create({
      _type: 'po', // Define the type as 'po'
      ...po,
      items: formattedItems // Include formatted items
    });
    return newPO;
  }
};
