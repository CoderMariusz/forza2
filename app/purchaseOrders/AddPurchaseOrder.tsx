import React, { useState, useEffect } from 'react';
import { getSuppliers, getItems } from '@/sanity/lib/client'; // Replace with your actual Sanity client methods
import { Item } from '@/types/item'; // Adjust the path to your Item type definition
import { Supplier } from '@/types/supplier'; // Adjust the path to your Supplier type definition

interface POModalProps {
  onClose: () => void;
  //onSave: (poData: { supplier: { _ref: string; _type: string }; deliveryDate: string; items: { item: { _ref: string; _type: string }; quantity: number }[] }) => void;
}

const POModal = ({ onClose }: POModalProps) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [poItems, setPOItems] = useState<{ item: Item; quantity: number }[]>(
    []
  );
  const [deliveryDate, setDeliveryDate] = useState('');
  const [error, setError] = useState('');

  // Fetch suppliers and items on component mount
  useEffect(() => {
    const fetchData = async () => {
      const suppliersData = await getSuppliers();
      const itemsData = await getItems();
      setSuppliers(suppliersData);
      setItems(itemsData);
    };

    fetchData();
  }, []);

  // Filter items by selected supplier
  useEffect(() => {
    console.log('Selected Supplier:', selectedSupplier);
    console.log('Items:', items);

    if (selectedSupplier) {
      const filtered = items.filter(
        (item) =>
          item.supplier &&
          item.supplier.name?.toString() === selectedSupplier.name?.toString()
      );
      console.log('Filtered Items:', filtered);

      setFilteredItems(filtered);
    } else {
      setFilteredItems([]);
    }
  }, [selectedSupplier, items]);

  const handleAddItem = (itemId: string, quantity: number) => {
    const selectedItem = filteredItems.find((item) => item._id === itemId);
    if (!selectedItem) return;

    setPOItems((prev) => [...prev, { item: selectedItem, quantity }]);
  };

  const handleSubmit = () => {
    if (!selectedSupplier || !deliveryDate || poItems.length === 0) {
      setError('All fields are required.');
      return;
    }

    if (!selectedSupplier._id) {
      setError('Selected supplier is invalid.');
      return;
    }

    // const poData = {
    //   supplier: { _ref: selectedSupplier._id, _type: 'reference' },
    //   deliveryDate,
    //   items: poItems
    //     .filter(
    //       (poItem): poItem is { item: Item; quantity: number } =>
    //         poItem.item._id !== undefined
    //     )
    //     .map((poItem) => {
    //       if (!poItem.item._id) {
    //         throw new Error('Item ID is undefined');
    //       }
    //       return {
    //         item: { _ref: poItem.item._id, _type: 'reference' },
    //         quantity: poItem.quantity
    //       };
    //     })
    // };

    try {
      //onSave(poData);
      onClose();
    } catch (error) {
      console.error('Error saving PO:', error);
      setError('Failed to save the purchase order.');
    }
  };

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50'>
      <div className='bg-white p-6 rounded shadow-lg w-2/3'>
        <h2 className='text-xl font-bold mb-4'>Create Purchase Order</h2>
        {error && <p className='text-red-500 mb-4'>{error}</p>}

        {/* Select Supplier */}
        <div className='mb-4'>
          <label className='block mb-1'>Supplier</label>
          <select
            value={selectedSupplier?._id || ''}
            onChange={(e) => {
              const supplier = suppliers.find((s) => s._id === e.target.value);
              setSelectedSupplier(supplier || null);
              setPOItems([]); // Clear items when supplier changes
            }}
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

        {/* Delivery Date */}
        <div className='mb-4'>
          <label className='block mb-1'>Delivery Date</label>
          <input
            type='date'
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className='border border-gray-300 rounded px-3 py-2 w-full'
          />
        </div>

        {/* Add Items to PO */}
        {selectedSupplier && (
          <div className='mb-4'>
            <label className='block mb-1'>Add Items</label>
            <div className='flex items-center'>
              <select
                className='border border-gray-300 rounded px-3 py-2 w-full mr-4'
                onChange={(e) => {
                  const selectedItemId = e.target.value;
                  const existingItem = poItems.find(
                    (poItem) => poItem.item._id === selectedItemId
                  );
                  if (existingItem) {
                    setError('Item already added.');
                    return;
                  }
                  handleAddItem(selectedItemId, 1); // Default quantity
                }}>
                <option
                  value=''
                  disabled>
                  Select Item
                </option>
                {filteredItems.map((item) => (
                  <option
                    key={item._id}
                    value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* PO Items Table */}
        {poItems.length > 0 && (
          <table className='table-auto w-full border-collapse border border-gray-300'>
            <thead>
              <tr className='bg-gray-200'>
                <th className='border border-gray-300 px-4 py-2'>Item</th>
                <th className='border border-gray-300 px-4 py-2'>Quantity</th>
                <th className='border border-gray-300 px-4 py-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {poItems.map((poItem, index) => (
                <tr key={poItem.item._id}>
                  <td className='border border-gray-300 px-4 py-2'>
                    {poItem.item.name}
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    <input
                      type='number'
                      min='1'
                      value={poItem.quantity}
                      onChange={(e) => {
                        const quantity = parseInt(e.target.value, 10);
                        setPOItems((prev) =>
                          prev.map((item, i) =>
                            i === index ? { ...item, quantity } : item
                          )
                        );
                      }}
                      className='border border-gray-300 rounded px-3 py-2 w-48'
                    />
                  </td>
                  <td className='border border-gray-300 px-4 py-2'>
                    <button
                      className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
                      onClick={() =>
                        setPOItems((prev) => prev.filter((_, i) => i !== index))
                      }>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

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
            Save PO
          </button>
        </div>
      </div>
    </div>
  );
};

export default POModal;
