import React, { useState, useEffect } from 'react';
import { getSuppliers, getItems, savePO } from '@/sanity/lib/client';
import { Item } from '@/types/item';
import { Supplier } from '@/types/supplier';
import { PO } from '@/types/PurchaseOrder';

interface POModalProps {
  onClose: () => void;
  onReset: () => void;
  initialData?: PO;
  editMode: boolean;
  currentUser?: string;
}

const POModal = ({
  onClose,
  onReset,
  initialData,
  currentUser,
  editMode = false
}: POModalProps) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [poItems, setPOItems] = useState<
    { item: Item; quantity: number; deliveryDateItem?: string }[]
  >([]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [error, setError] = useState('');

  // Aktualizuj `selectedSupplier` i `poItems` tylko w `useEffect`
  useEffect(() => {
    if (initialData?.supplier && suppliers.length > 0) {
      const supplier = suppliers.find(
        (s) => s._id === initialData.supplier._ref
      );
      setSelectedSupplier(supplier || null);
    }

    if (initialData?.items && items.length > 0) {
      const updatedPOItems = initialData.items.map((poItem) => ({
        item: items.find((item) => item._id === poItem.item._ref) || {
          _id: '',
          name: 'Unknown',
          itemNumber: '',
          price: 0,
          measureUnit: '',
          expirationMethod: { _ref: '', type: 'reference', name: '' },
          supplier: { _ref: '', type: 'reference', name: '' }
        },
        quantity: poItem.quantity,
        deliveryDateItem: poItem.deliveryDateItem || ''
      }));
      setPOItems(updatedPOItems);
    }

    if (initialData?.deliveryDate) {
      setDeliveryDate(initialData.deliveryDate);
    }
  }, [initialData, suppliers, items]);

  // Fetch suppliers and items on mount
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

  const handleSubmit = async () => {
    if (!selectedSupplier || !deliveryDate || poItems.length === 0) {
      setError('All fields are required.');
      return;
    }

    const generatePONumber = () => {
      const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
      return `PO-` + date + Math.floor(Math.random() * 100);
    };

    try {
      const poData: PO = {
        ...initialData, // Use existing data for editing
        PoNumber: initialData?.PoNumber || generatePONumber(),
        supplier: { _ref: selectedSupplier._id!, _type: 'reference' },
        deliveryDate,
        items: poItems.map((poItem) => {
          console.log(poItem);
          return {
            item: {
              _ref: poItem.item._id as string,
              _type: 'reference'
            },
            quantity: poItem.quantity,
            status: 'Open', // Default status for each item
            deliveryDateItem: poItem.deliveryDateItem
              ? poItem.deliveryDateItem
              : deliveryDate // Include item-specific delivery date
          };
        }),
        addBy: currentUser || 'Unknown User',
        createdAt: editMode
          ? (initialData?.createdAt ?? new Date().toISOString())
          : new Date().toISOString(),
        status: editMode && poItems.length === 0 ? 'Cancelled' : 'Open order'
      };

      // Save or update the PO
      if (editMode) {
        await savePO(poData);
      } else {
        await savePO(poData);
      }
      onReset();
      onClose();
    } catch (error) {
      console.error('Error saving PO:', error);
      setError('Failed to save the purchase order. Please try again.');
    }
  };

  const handleClose = () => {
    onReset();
    onClose();
  };

  if (!suppliers.length || !items.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50'>
      <div className='bg-white p-6 rounded shadow-lg w-2/3'>
        <h2 className='text-xl font-bold mb-4'>
          {editMode ? 'Edit Purchase Order' : 'Create Purchase Order'}
        </h2>
        {error && <p className='text-red-500 mb-4'>{error}</p>}

        {/* Select Supplier */}

        <div className='mb-4'>
          <label className='block mb-1'>Supplier</label>
          <select
            value={
              initialData?.supplier.name
                ? initialData?.supplier.name
                : selectedSupplier?._id || ''
            }
            onChange={(e) => {
              const supplier = suppliers.find((s) => s._id === e.target.value);
              setSelectedSupplier(supplier || null);
              setPOItems([]); // Clear items when supplier changes
            }}
            disabled={editMode} // Disable supplier selection in edit mode
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

        <button
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          onClick={() => {
            setPOItems((prev) => [
              ...prev,
              {
                item: {
                  _id: '',
                  name: '',
                  itemNumber: '',
                  price: 0,
                  measureUnit: '',
                  expirationMethod: { _ref: '', type: 'reference', name: '' },
                  supplier: { _ref: '', type: 'reference', name: '' },
                  deliveryDateItem: deliveryDate || ''
                },
                quantity: 1
              }
            ]);
          }}>
          Add Item
        </button>

        {/* PO Items Table */}
        <table className='table-auto w-full border-collapse border border-gray-300'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border border-gray-300 px-4 py-2'>Item</th>
              <th className='border border-gray-300 px-4 py-2'>Quantity</th>
              <th className='border border-gray-300 px-4 py-2'>date</th>
              <th className='border border-gray-300 px-4 py-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {poItems.map(
              (
                poItem: {
                  item: Item;
                  quantity: number;
                  deliveryDateItem?: string;
                },
                index
              ) => {
                console.log(poItem);

                return (
                  <tr key={index}>
                    <td className='border border-gray-300 px-4 py-2'>
                      {poItem && poItem.item.name ? (
                        poItem.item.name
                      ) : (
                        <select
                          value={poItem.item._id || ''}
                          onChange={(e) => {
                            const selectedItem = items.find(
                              (item) => item._id === e.target.value
                            );
                            if (selectedItem) {
                              setPOItems((prev) =>
                                prev.map((item, i) =>
                                  i === index
                                    ? { ...item, item: selectedItem }
                                    : item
                                )
                              );
                            }
                          }}
                          className='border border-gray-300 rounded px-3 py-2 w-full'>
                          <option
                            value=''
                            disabled>
                            Select Item
                          </option>
                          {items
                            .filter(
                              (item) =>
                                item.supplier?.name === selectedSupplier?.name
                            )
                            .map((item) => (
                              <option
                                key={item._id}
                                value={item._id}>
                                {item.name}
                              </option>
                            ))}
                        </select>
                      )}
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
                      <input
                        type='date'
                        value={poItem.deliveryDateItem || ''}
                        onChange={(e) => {
                          const deliveryDateItem = e.target.value;
                          setPOItems((prev) =>
                            prev.map((item, i) =>
                              i === index ? { ...item, deliveryDateItem } : item
                            )
                          );
                        }}
                        className='border border-gray-300 rounded px-3 py-2 w-full'
                      />
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      <button
                        className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
                        onClick={() =>
                          setPOItems((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }>
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>

        {/* Buttons */}
        <div className='flex justify-end mt-4'>
          <button
            className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2'
            onClick={handleClose}>
            Cancel
          </button>
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
            onClick={handleSubmit}>
            {editMode ? 'Update PO' : 'Save PO'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default POModal;
