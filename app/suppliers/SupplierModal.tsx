// components/SupplierModal.tsx
import React, { useState } from 'react';
import { Supplier } from '@/types/supplier';
import { saveSupplier } from '@/sanity/lib/client';

interface SupplierModalProps {
  onClose: () => void;
  onSave: (supplier: Supplier) => void;
  initialData: Supplier | null;
}

const SupplierModal = ({
  onClose,
  onSave,
  initialData
}: SupplierModalProps) => {
  const [formData, setFormData] = useState<Supplier>(
    initialData || {
      name: '',
      supplierCode: '',
      contactDetail: {
        email: '',
        phone: ''
      },
      country: '',
      taxCode: ''
    }
  );
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith('contactDetail.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        contactDetail: {
          ...prev.contactDetail,
          [key]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async () => {
    const { name, supplierCode, contactDetail, country, taxCode } = formData;

    if (
      !name ||
      !supplierCode ||
      !contactDetail.email ||
      !contactDetail.phone ||
      !country ||
      !taxCode
    ) {
      setError('All fields are required.');
      return;
    }

    try {
      const savedSupplier = await saveSupplier(formData);
      onSave(savedSupplier);
    } catch (err) {
      console.error(err);
      setError('Error saving supplier.');
    }
  };

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50'>
      <div className='bg-white p-6 rounded shadow-lg w-1/3'>
        <h2 className='text-xl font-bold mb-4'>
          {initialData ? 'Edit Supplier' : 'Add New Supplier'}
        </h2>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        <div className='mb-4'>
          <label className='block mb-1'>Supplier Code</label>
          <input
            type='text'
            name='supplierCode'
            value={formData.supplierCode}
            onChange={handleChange}
            className='border border-gray-300 rounded px-3 py-2 w-full'
            disabled={!!initialData}
          />
        </div>
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
        <div className='mb-4'>
          <label className='block mb-1'>Email</label>
          <input
            type='email'
            name='contactDetail.email'
            value={formData.contactDetail.email}
            onChange={handleChange}
            className='border border-gray-300 rounded px-3 py-2 w-full'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Country</label>
          <select
            name='country'
            value={formData.country}
            onChange={handleChange}
            className='border border-gray-300 rounded px-3 py-2 w-full'>
            <option
              value=''
              disabled>
              Select a country
            </option>
            <option value='US'>United States</option>
            <option value='UK'>United Kingdom</option>
            <option value='CA'>Canada</option>
            <option value='AU'>Australia</option>
            <option value='DE'>Germany</option>
          </select>
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Country</label>
          <input
            type='text'
            name='country'
            value={formData.country}
            onChange={handleChange}
            className='border border-gray-300 rounded px-3 py-2 w-full'
          />
          {/* Alternatively, use a select input with predefined countries */}
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Tax Code</label>
          <input
            type='text'
            name='taxCode'
            value={formData.taxCode}
            onChange={handleChange}
            className='border border-gray-300 rounded px-3 py-2 w-full'
          />
        </div>
        <div className='flex justify-end'>
          <button
            className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2'
            onClick={onClose}>
            Cancel
          </button>
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
            onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierModal;
