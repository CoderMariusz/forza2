'use client';

import React, { useState, useEffect } from 'react';
import { getPOs } from '@/sanity/lib/client'; // Replace with actual Sanity client function
import { PO } from '@/types/PurchaseOrder'; // Define the PO interface
import AddPurchaseOrder from './AddPurchaseOrder'; // Placeholder for future modal component
import { useUser } from '@clerk/nextjs';
import PODetailsModal from './PODetailsModal';

const PurchaseOrderPage = () => {
  const [pos, setPOs] = useState<PO[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [filteredPOs, setFilteredPOs] = useState<PO[]>([]);
  const [selectedPOId, setSelectedPOId] = useState<string | null>(null);
  const [editPo, setEditPo] = useState<PO | null>(null);
  const [filters, setFilters] = useState({
    poNumber: '',
    supplier: '',
    deliveryDate: '',
    createdBy: '',
    creationDate: '',
    status: ''
  });
  const { user } = useUser();

  const resetInitialData = () => {
    setEditPo(null);
  };

  const handleCreate = () => {
    setEditPo(null); // Wyczyść dane PO dla nowego PO
  };

  // Fetch POs from Sanity
  useEffect(() => {
    const fetchPOs = async () => {
      const results = await getPOs(); // Replace with your function to fetch POs
      setPOs(results);
      setFilteredPOs(results);
    };

    fetchPOs();
  }, []);

  // Filter POs based on the filter inputs
  useEffect(() => {
    const filtered = pos.filter((po) => {
      const matchesPO = po.PoNumber?.toLowerCase().includes(
        filters.poNumber?.toLowerCase()
      );
      const matchesSupplier = po.supplier?._ref
        .toLowerCase()
        .includes(filters.supplier?.toLowerCase());
      const matchesDeliveryDate = po.deliveryDate.includes(
        filters.deliveryDate
      );
      const matchesCreatedBy = po.addBy
        ?.toLowerCase()
        .includes(filters.createdBy?.toLowerCase());
      const matchesCreationDate = po.createdAt.includes(filters.creationDate);

      const matchesStatus = !filters.status || po.status === filters.status;

      return (
        matchesPO &&
        matchesSupplier &&
        matchesDeliveryDate &&
        matchesCreatedBy &&
        matchesCreationDate &&
        matchesStatus
      );
    });

    setFilteredPOs(filtered);
  }, [filters, pos]);

  // Update filters
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Purchase Orders</h1>

      {/* Filters */}
      <div className='overflow-x-auto'>
        <table className='table-auto w-full border-collapse border border-gray-300'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border border-gray-300 px-4 py-2'>
                <input
                  type='text'
                  name='poNumber'
                  value={filters.poNumber}
                  onChange={handleFilterChange}
                  placeholder='Filter by PO Number'
                  className='border border-gray-300 rounded px-2 py-1 w-full'
                />
              </th>
              <th className='border border-gray-300 px-4 py-2'>
                <input
                  type='text'
                  name='supplier'
                  value={filters.supplier}
                  onChange={handleFilterChange}
                  placeholder='Filter by Supplier'
                  className='border border-gray-300 rounded px-2 py-1 w-full'
                />
              </th>
              <th className='border border-gray-300 px-4 py-2'>
                <input
                  type='date'
                  name='deliveryDate'
                  value={filters.deliveryDate}
                  onChange={handleFilterChange}
                  className='border border-gray-300 rounded px-2 py-1 w-full'
                />
              </th>
              <th className='border border-gray-300 px-4 py-2'>
                <input
                  type='text'
                  name='createdBy'
                  value={filters.createdBy}
                  onChange={handleFilterChange}
                  placeholder='Filter by Created By'
                  className='border border-gray-300 rounded px-2 py-1 w-full'
                />
              </th>
              <th className='border border-gray-300 px-4 py-2'>
                <input
                  type='date'
                  name='creationDate'
                  value={filters.creationDate}
                  onChange={handleFilterChange}
                  className='border border-gray-300 rounded px-2 py-1 w-full'
                />
              </th>
              <th className='border border-gray-300 px-4 py-2'>
                <select
                  name='status'
                  value={filters.status || ''}
                  onChange={handleFilterChange}
                  className='border border-gray-300 rounded px-2 py-1 w-full'>
                  <option value=''>Filter by Status</option>
                  <option value='Open order'>Open</option>
                  <option value='Closed'>Closed</option>
                  <option value='Cancelled'>Cancelled</option>
                </select>
              </th>
            </tr>
            <tr>
              <th className='border border-gray-300 px-4 py-2'>PO Number</th>
              <th className='border border-gray-300 px-4 py-2'>Supplier</th>
              <th className='border border-gray-300 px-4 py-2'>
                Delivery Date
              </th>
              <th className='border border-gray-300 px-4 py-2'>Created By</th>
              <th className='border border-gray-300 px-4 py-2'>
                Creation Date
              </th>
              <th className='border border-gray-300 px-4 py-2'>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPOs.map((po) => (
              <tr key={po.PoNumber}>
                <td className='border border-gray-300 px-4 py-2'>
                  <button
                    className='text-blue-500 hover:underline'
                    onClick={() => po._id && setSelectedPOId(po._id)}>
                    {po.PoNumber}
                  </button>
                </td>
                <td className='border border-gray-300 px-4 py-2'>
                  {po.supplier?.name}
                </td>
                <td
                  className={`border border-gray-300 px-4 py-2  ${
                    po.items.some(
                      (item) =>
                        item.deliveryDateItem &&
                        new Date(item.deliveryDateItem) <
                          new Date(new Date().setDate(new Date().getDate() - 1))
                    )
                      ? 'text-red-700 bg-yellow-400'
                      : po.items.some(
                            (item) =>
                              item.deliveryDateItem &&
                              new Date(item.deliveryDateItem) <
                                new Date(
                                  new Date().setDate(new Date().getDate() - 3)
                                )
                          )
                        ? 'text-red-700 bg-red-300'
                        : ''
                  } `}>
                  {po.deliveryDate}
                </td>
                <td className='border border-gray-300 px-4 py-2'>{po.addBy}</td>
                <td className='border border-gray-300 px-4 py-2'>
                  {po.createdAt}
                </td>
                <td className='border border-gray-300 px-4 py-2'>
                  {po.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => {
            handleCreate();
            setModalOpen(true);
          }}
          className='bg-blue-500 text-white px-4 py-2 rounded'>
          Create Purchase Order
        </button>
      </div>
      {isModalOpen && (
        <AddPurchaseOrder
          onClose={() => setModalOpen(false)}
          currentUser={user?.fullName || ''}
          initialData={
            editPo || {
              PoNumber: '',
              supplier: { _ref: '', _type: '' },
              deliveryDate: '',
              items: [],
              addBy: user?.fullName || '',
              createdAt: new Date().toISOString(),
              status: 'Draft'
            }
          }
          editMode={editPo ? true : false}
          onReset={resetInitialData}
        />
      )}
      {selectedPOId && (
        <PODetailsModal
          poId={selectedPOId}
          onClose={() => setSelectedPOId(null)}
          setEditPO={(Po: PO) => {
            setEditPo(Po);
            setModalOpen(true);
            setSelectedPOId(null);
          }}
        />
      )}
    </div>
  );
};

export default PurchaseOrderPage;
