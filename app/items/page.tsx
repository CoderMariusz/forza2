'use client';

import React, { useState, useEffect } from 'react';
import { getItems } from '@/sanity/lib/client'; // Replace with your actual Sanity client
import MaterialModal from './addItem'; // Placeholder for future modal component
import { Item } from '@/types/item';

const ItemPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  // Fetch items from Sanity
  useEffect(() => {
    const fetchItems = async () => {
      const results = await getItems();
      setItems(results);
      setFilteredItems(results);
      console.log(results);
    };

    fetchItems();
  }, []);

  // Search filtering
  useEffect(() => {
    const filtered = items.filter((item: Item) =>
      [item.name, item.itemNumber, item._id, item.supplier?.name || '']
        .filter(Boolean)
        .some((field) =>
          field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    setFilteredItems(filtered);
    console.log(filtered);
  }, [searchQuery, items]);

  const openAddModal = () => {
    setModalOpen(true);
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Items</h1>

      {/* Search Bar */}
      <div className='mb-4'>
        <input
          type='text'
          placeholder='Search by Name, Item Number, or Supplier'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='border border-gray-300 rounded px-3 py-2 w-full'
        />
      </div>

      {/* Items Table */}
      <table className='table-auto w-full border-collapse border border-gray-300'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='border border-gray-300 px-2 py-1'>Item Number</th>
            <th className='border border-gray-300 px-2 py-1'>Name</th>
            <th className='border border-gray-300 px-2 py-1'>Price</th>
            <th className='border border-gray-300 px-2 py-1'>Measure Unit</th>
            <th className='border border-gray-300 px-2 py-1'>
              Expiration Method
            </th>
            <th className='border border-gray-300 px-2 py-1'>Supplier</th>
            <th className='border border-gray-300 px-2 py-1'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.itemNumber}>
              <td className='border border-gray-300 px-2 py-1'>
                {item.itemNumber}
              </td>
              <td className='border border-gray-300 px-2 py-1'>{item.name}</td>
              <td className='border border-gray-300 px-2 py-1'>{item.price}</td>
              <td className='border border-gray-300 px-2 py-1'>
                {item.measureUnit}
              </td>
              <td className='border border-gray-300 px-2 py-1'>
                {item.expirationMethod?.name}
              </td>
              <td className='border border-gray-300 px-2 py-1'>
                {item.supplier?.name}
              </td>
              <td className='border border-gray-300 px-2 py-1'>
                {/* Edit Action Placeholder */}
                <button className='bg-green-800 text-white px-2 py-1 rounded hover:bg-green-600'>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Item Button */}
      <div className='mt-4'>
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          onClick={openAddModal}>
          Add Item
        </button>
      </div>

      {/* Modal Placeholder */}
      {isModalOpen && (
        <MaterialModal
          onClose={() => setModalOpen(false)}
          onSave={(item: Item) => setItems((prev) => [...prev, item])}
          initialData={null}
          existingItems={items}
        />
      )}
    </div>
  );
};

export default ItemPage;
