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
  useCdn: true // Set to false if statically generating pages, using ISR or tag-based revalidation
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
  return data;
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
