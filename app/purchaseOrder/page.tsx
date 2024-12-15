'use client';

import React, { useState, useEffect } from 'react';
import { getPOs } from '@/sanity/lib/client'; // Replace with actual Sanity client function
import { PO } from '@/types/PurchaseOrder'; // Define the PO interface

const PurchaseOrderPage = () => {
  const [pos, setPOs] = useState<PO[]>([]);
  const [filteredPOs, setFilteredPOs] = useState<PO[]>([]);
  const [filters, setFilters] = useState({
    poNumber: '',
    supplier: '',
    deliveryDate: '',
    createdBy: '',
    creationDate: ''
  });

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
      const matchesPO = po.poNumber
        .toLowerCase()
        .includes(filters.poNumber.toLowerCase());
      const matchesSupplier = po.supplier
        ?.toLowerCase()
        .includes(filters.supplier.toLowerCase());
      const matchesDeliveryDate = po.deliveryDate.includes(
        filters.deliveryDate
      );
      const matchesCreatedBy = po.createdBy
        ?.toLowerCase()
        .includes(filters.createdBy.toLowerCase());
      const matchesCreationDate = po.creationDate.includes(
        filters.creationDate
      );

      return (
        matchesPO &&
        matchesSupplier &&
        matchesDeliveryDate &&
        matchesCreatedBy &&
        matchesCreationDate
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
            </tr>
          </thead>
          <tbody>
            {filteredPOs.map((po) => (
              <tr key={po.poNumber}>
                <td className='border border-gray-300 px-4 py-2'>
                  {po.poNumber}
                </td>
                <td className='border border-gray-300 px-4 py-2'>
                  {po.supplier}
                </td>
                <td className='border border-gray-300 px-4 py-2'>
                  {po.deliveryDate}
                </td>
                <td className='border border-gray-300 px-4 py-2'>
                  {po.createdBy}
                </td>
                <td className='border border-gray-300 px-4 py-2'>
                  {po.creationDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrderPage;
