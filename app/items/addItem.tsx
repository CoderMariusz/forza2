import React, { useState, useEffect } from 'react';
import {
  getSuppliers,
  getExpirationMethods,
  saveItem
} from '@/sanity/lib/client'; // Replace with actual Sanity client methods
import { Item } from '@/types/item';
import { Supplier } from '@/types/supplier';
import { expirationMethod } from '@/types/expirationMethods';

interface ItemModalProps {
  onClose: () => void;
  onSave: (item: Item) => void;
  initialData: Item | null;
  existingItems: Item[]; // Pass existing items for unique validation
}

const ItemModal = ({
  onClose,
  onSave,
  initialData,
  existingItems
}: ItemModalProps) => {
  const [formData, setFormData] = useState<Item>(
    initialData || {
      itemNumber: '',
      name: '',
      price: 0,
      measureUnit: '',
      expirationMethod: { _ref: '', type: 'reference', name: '' },
      supplier: { _ref: '', type: 'reference', name: '' }
    }
  );
  const [suppliers, setSuppliers] = useState<{ _id?: string; name: string }[]>(
    []
  );
  const [expirationMethods, setExpirationMethods] = useState<
    { _id?: string; name: string }[]
  >([]);
  const [error, setError] = useState('');

  // Fetch suppliers and expiration methods from Sanity
  useEffect(() => {
    const fetchOptions = async () => {
      const suppliersData: Supplier[] = await getSuppliers();
      const expirationMethodsData: expirationMethod[] =
        await getExpirationMethods();
      setSuppliers(suppliersData);
      setExpirationMethods(expirationMethodsData);
    };

    fetchOptions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'supplier' || name === 'expirationMethod') {
      const selectedOption =
        name === 'supplier' ? suppliers : expirationMethods;
      const selected = selectedOption.find((option) => option._id === value);

      if (selected) {
        setFormData((prev) => ({
          ...prev,
          [name]: {
            _ref: selected._id,
            _type: 'reference'
          }
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'price' ? parseFloat(value) : value
      }));
    }
  };

  const handleSubmit = () => {
    const { itemNumber, name, price, measureUnit, expirationMethod, supplier } =
      formData;

    // Validation
    if (
      !itemNumber ||
      !name ||
      !price ||
      !measureUnit ||
      !expirationMethod._ref ||
      !supplier._ref
    ) {
      setError('All fields are required.');
      return;
    }

    console.log('Saving item:', formData);

    if (!initialData) {
      // Ensure item number is unique when adding a new item
      console.log('Checking for existing items:', existingItems);

      const itemExists = existingItems.some(
        (item) => item.itemNumber === itemNumber
      );
      if (itemExists) {
        setError('Item number already exists. Please choose another.');
        return;
      }
    }

    const sanitizedFormData = {
      ...formData,
      expirationMethod: {
        _ref: expirationMethod._ref,
        _type: 'reference',
        type: expirationMethod.type,
        name: expirationMethod.name
      },
      supplier: {
        _ref: supplier._ref,
        _type: 'reference',
        type: supplier.type,
        name: supplier.name
      }
    };

    console.log('Sanitized form data:', sanitizedFormData);

    try {
      saveItem(sanitizedFormData);
      onSave(sanitizedFormData);
    } catch (error) {
      console.error('Error saving item:', error);
      setError('Failed to save the item.');
    }
  };

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50'>
      <div className='bg-white p-6 rounded shadow-lg w-1/3'>
        <h2 className='text-xl font-bold mb-4'>
          {initialData ? 'Edit Item' : 'Add New Item'}
        </h2>
        {error && <p className='text-red-500 mb-4'>{error}</p>}

        {/* Item Number */}
        <div className='mb-4'>
          <label className='block mb-1'>Item Number</label>
          <input
            type='text'
            name='itemNumber'
            value={formData.itemNumber}
            onChange={handleChange}
            className='border border-gray-300 rounded px-3 py-2 w-full'
            disabled={!!initialData} // Disable editing item number when editing
          />
        </div>

        {/* Name */}
        <div className='mb-4'>
          <label className='block mb-1'>Name</label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            className='border border-gray-300 rounded px-3 py-2 w-full'
          />
        </div>

        {/* Price */}
        <div className='mb-4'>
          <label className='block mb-1'>Price</label>
          <input
            type='number'
            name='price'
            value={formData.price}
            onChange={handleChange}
            className='border border-gray-300 rounded px-3 py-2 w-full'
          />
        </div>

        {/* Measure Unit */}
        <div className='mb-4'>
          <label className='block mb-1'>Measure Unit</label>
          <input
            type='text'
            name='measureUnit'
            value={formData.measureUnit}
            onChange={handleChange}
            className='border border-gray-300 rounded px-3 py-2 w-full'
          />
        </div>

        {/* Expiration Method */}
        <div className='mb-4'>
          <label className='block mb-1'>Expiration Method</label>
          <select
            name='expirationMethod'
            value={formData.expirationMethod?._ref || ''}
            onChange={handleChange}
            className='border border-gray-300 rounded px-3 py-2 w-full'>
            <option
              value=''
              disabled>
              Select Expiration Method
            </option>
            {expirationMethods.map((method) => (
              <option
                key={method._id}
                value={method._id}>
                {method.name}
              </option>
            ))}
          </select>
        </div>

        {/* Supplier */}
        <div className='mb-4'>
          <label className='block mb-1'>Supplier</label>
          <select
            name='supplier'
            value={formData.supplier?._ref || ''}
            onChange={handleChange}
            className='border border-gray-300 rounded px-3 py-2 w-full'>
            <option
              value=''
              disabled>
              Select Supplier
            </option>
            {suppliers.map((supplier) => (
              <option
                key={supplier._id}
                value={supplier._id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className='flex justify-end mt-4'>
          <button
            className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2'
            onClick={onClose}>
            Cancel
          </button>
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
            onClick={handleSubmit}>
            {initialData ? 'Save' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
