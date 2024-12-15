import { createClient } from 'next-sanity';
import { Supplier } from '@/types/supplier';

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
  const data = await client.fetch(`*[_type == "item"]`);
  return data;
};

export const getSuppliers = async (): Promise<Supplier[]> => {
  const data = await client.fetch(`*[_type == "supplier"]`);
  return data;
};

export const getExpirationMethods = async (): Promise<Supplier[]> => {
  const data = await client.fetch(`*[_type == "expirationMethod"]`);
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
