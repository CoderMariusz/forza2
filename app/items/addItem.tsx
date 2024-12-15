import React, { useState } from 'react';

interface Material {
  itemNumber: string;
  name: string;
  price: number;
  measureUnit: string;
  expirationMethod: string;
  supplier: string;
}

interface MaterialModalProps {
  onClose: () => void;
  onSave: (material: Material) => void;
  existingMaterials: Material[];
  initialData: Material | null;
}

const MaterialModal = ({
  onClose,
  onSave,
  existingMaterials,
  initialData
}: MaterialModalProps) => {
  const [formData, setFormData] = useState<Material>(
    initialData || {
      itemNumber: '',
      name: '',
      price: 0,
      measureUnit: '',
      expirationMethod: 'Provided',
      supplier: ''
    }
  );
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = () => {
    const { itemNumber, name, price, measureUnit, expirationMethod, supplier } =
      formData;

    if (
      !itemNumber ||
      !name ||
      !price ||
      !measureUnit ||
      !expirationMethod ||
      !supplier
    ) {
      setError('All fields are required.');
      return;
    }

    if (
      !initialData &&
      existingMaterials.some((material) => material.itemNumber === itemNumber)
    ) {
      setError('Item number already exists.');
      return;
    }

    onSave(formData);
  };

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50'>
      <div className='bg-white p-6 rounded shadow-lg w-1/3'>
        <h2 className='text-xl font-bold mb-4'>
          {initialData ? 'Edit Material' : 'Add New Material'}
        </h2>
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        <div className='mb-4'>
          <label className='block mb-1'>Item Number</label>
          <input
            type='text'
            name='itemNumber'
            value={formData.itemNumber}
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
          <label className='block mb-1'>Price</label>
          <input
            type='number'
            name='price'
            value={formData.price}
            onChange={handleChange}
            className='border border-gray-300 rounded px-3 py-2 w-full'
          />
        </div>
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
        <div className='mb-4'>
          <label className='block mb-1'>Expiration Method</label>
          <select
            name='expirationMethod'
            value={formData.expirationMethod}
            onChange={handleChange}
            className='border border-gray-300 rounded px-3 py-2 w-full'>
            <option value='Provided'>Provided</option>
            <option value='From Delivery Date'>From Delivery Date</option>
            <option value='From Production Date'>From Production Date</option>
          </select>
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Supplier</label>
          <input
            type='text'
            name='supplier'
            value={formData.supplier}
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

export default MaterialModal;
