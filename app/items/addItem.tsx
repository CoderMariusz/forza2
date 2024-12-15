import React, { useState, useEffect } from 'react';
import { getSuppliers, getExpirationMethods } from '@/sanity/lib/client'; // Replace with actual Sanity client methods
import { Item } from '@/types/item'; // Adjust the path to your Item type definition

interface ItemModalProps {
  onClose: () => void;
  onSave: (item: Item) => void;
  initialData: Item | null;
}

const ItemModal = ({ onClose, onSave, initialData }: ItemModalProps) => {
  const [formData, setFormData] = useState<Item>(
    initialData || {
      _id: '',
      itemNumber: '',
      name: '',
      price: 0,
      measureUnit: '',
      expirationMethod: { _ref: '', _id: '', name: '' },
      supplier: { _ref: '', _id: '', name: '' }
    }
  );
  const [suppliers, setSuppliers] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [expirationMethods, setExpirationMethods] = useState<
    { _id: string; name: string }[]
  >([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibility, setVisibility] = useState(false);

  // Fetch suppliers and expiration methods from Sanity
  useEffect(() => {
    const fetchOptions = async () => {
      const suppliersData = (await getSuppliers()).filter(
        (supplier) => supplier._id
      ) as { _id: string; name: string }[]; // Fetch suppliers from Sanity and filter out those without _id
      const expirationMethodsData = (await getExpirationMethods()).filter(
        (method) => method._id
      ) as { _id: string; name: string }[]; // Fetch expiration methods and filter out those without _id
      setSuppliers(suppliersData);
      setExpirationMethods(expirationMethodsData);
    };

    fetchOptions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle references for supplier and expiration method
    if (name === 'supplier' || name === 'expirationMethod') {
      const selectedOption =
        name === 'supplier' ? suppliers : expirationMethods;
      const selected = selectedOption.find((option) => option._id === value);

      if (selected) {
        setFormData((prev) => ({
          ...prev,
          [name]: {
            _ref: selected._id,
            _id: selected._id,
            _type: 'reference',
            name: selected.name
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

    if (
      !itemNumber ||
      !name ||
      !price ||
      !measureUnit ||
      !expirationMethod?._ref ||
      !supplier?._ref
    ) {
      setError('All fields are required.');
      return;
    }

    onSave(formData);
  };

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50'>
      <div className='bg-white p-6 rounded shadow-lg w-1/3'>
        <h2 className='text-xl font-bold mb-4'>
          {initialData ? 'Edit Item' : 'Add New Item'}
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
          <div className='relative'>
            <input
              type='text'
              placeholder='Search Expiration Method'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setVisibility(true)}
              className='border border-gray-300 rounded px-3 py-2 w-full'
            />
            {visibility && (
              <div className='absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full max-h-40 overflow-y-auto'>
                {expirationMethods
                  .filter((method) =>
                    method.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .map((method) => (
                    <div
                      key={method._id}
                      className='px-3 py-2 hover:bg-gray-200 cursor-pointer'
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          expirationMethod: {
                            _ref: method._id,
                            _id: method._id,
                            _type: 'reference',
                            name: method.name
                          }
                        }));
                        setSearchQuery(method.name);
                        setVisibility(false); // Clear search query after selection
                      }}>
                      {method.name}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

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

export default ItemModal;
