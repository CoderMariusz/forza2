import React, { useEffect, useState } from 'react';
import { getPOById, getItemById } from '@/sanity/lib/client'; // Adjust to match your Sanity client functions
import { Item } from '@/types/item';
import { PO } from '@/types/PurchaseOrder';

interface PODetailsModalProps {
  poId: string;
  onClose: () => void;
  setEditPO: (po: PO) => void;
}

const PODetailsModal = ({ poId, onClose, setEditPO }: PODetailsModalProps) => {
  const [poDetails, setPODetails] = useState<PO>({} as PO);
  const [items, setItems] = useState<
    { item: Item; quantity: number; delivery?: string; status?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const po = await getPOById(poId); // Fetch PO details by ID
        const itemDetails = await Promise.all(
          po.items.map(
            async (poItem: {
              item: { _ref: string; _type: string; name?: string };
              quantity: number;
              status?: string;
              deliveryDateItem?: string;
            }) => {
              const item = await getItemById(poItem.item._ref);
              return {
                item,
                quantity: poItem.quantity,
                delivery: poItem.deliveryDateItem,
                status: poItem.status
              };
            }
          )
        );
        setPODetails(po);
        setItems(itemDetails);
      } catch (error) {
        console.error('Error fetching PO details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [poId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50'>
      <div className='bg-white p-6 rounded shadow-lg w-2/3'>
        <h2 className='text-2xl font-bold mb-4'>PO Details</h2>

        {poDetails && (
          <>
            <p>
              <strong>PO Number:</strong> {poDetails.PoNumber}
            </p>
            <p>
              <strong>Supplier:</strong> {poDetails.supplier?.name || 'N/A'}
            </p>
            <p>
              <strong>Delivery Date:</strong> {poDetails.deliveryDate}
            </p>
            <p>
              <strong>Status:</strong> {poDetails.status}
            </p>
            <p>
              <strong>Created By:</strong> {poDetails.addBy}
            </p>
            <p>
              <strong>Created At:</strong>{' '}
              {new Date(poDetails.createdAt).toLocaleDateString()}
            </p>

            <h3 className='text-lg font-semibold mt-4 mb-2'>Items</h3>
            <table className='table-auto w-full border-collapse border border-gray-300'>
              <thead>
                <tr className='bg-gray-200'>
                  <th className='border border-gray-300 px-4 py-2'>Item</th>
                  <th className='border border-gray-300 px-4 py-2'>Quantity</th>
                  <th className='border border-gray-300 px-4 py-2'>
                    Delivery date
                  </th>
                  <th className='border border-gray-300 px-4 py-2'>Status</th>
                  <th className='border border-gray-300 px-4 py-2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((poItem, index) => (
                  <tr key={index}>
                    <td className='border border-gray-300 px-4 py-2'>
                      {poItem.item.name}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {poItem.quantity}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {poItem.delivery?.toString() || 'N/A'}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {poItem.status}
                    </td>
                    <td className='border border-gray-300 w-64 px-4 py-2'>
                      <button className='bg-blue-500 text-white m-2 px-4 py-2 rounded hover:bg-blue-600'>
                        Edit line
                      </button>
                      <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
                        delete line
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <div className='flex justify-end mt-4'>
          <button
            className='bg-gray-500 text-white m-1 px-4 py-2 rounded hover:bg-gray-600'
            onClick={onClose}>
            Close
          </button>
          <button
            className='bg-blue-500 text-white m-1 px-4 py-2 rounded hover:bg-blue-600'
            onClick={() => setEditPO(poDetails)}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PODetailsModal;
