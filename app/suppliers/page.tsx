// pages/suppliers.tsx
'use client';
import React, { useState, useEffect } from 'react';
import SupplierModal from './SupplierModal';
import { Supplier } from '../../types/supplier';
import { getSuppliers } from '@/sanity/lib/client';

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    // Fetch suppliers from Sanity
    const fetchSuppliers = async () => {
      const data = await getSuppliers();
      setSuppliers(data);
    };
    fetchSuppliers();
  }, []);

  const handleAddSupplier = (supplier: Supplier) => {
    setSuppliers((prev) => [...prev, supplier]);
    setModalOpen(false);
  };

  const handleEditSupplier = (updatedSupplier: Supplier) => {
    setSuppliers((prev) =>
      prev.map((s) => (s._id === updatedSupplier._id ? updatedSupplier : s))
    );
    setModalOpen(false);
  };

  const openAddModal = () => {
    setCurrentSupplier(null);
    setModalOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setModalOpen(true);
  };

  return (
    <div className='container mx-auto p-2'>
      <h1 className='text-2xl font-bold mb-2'>Suppliers</h1>
      <table className='table-auto w-full border-collapse border border-gray-300'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='border border-gray-300 px-2 py-1'>Supplier Code</th>
            <th className='border border-gray-300 px-2 py-1'>Name</th>
            <th className='border border-gray-300 px-2 py-1'>Email</th>
            <th className='border border-gray-300 px-2 py-1'>Phone</th>
            <th className='border border-gray-300 px-2 py-1'>Country</th>
            <th className='border border-gray-300 px-2 py-1'>Tax Code</th>
            <th className='border border-gray-300 px-2 py-1'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier._id}>
              <td className='border border-gray-300 px-2 py-1'>
                {supplier.supplierCode}
              </td>
              <td className='border border-gray-300 px-2 py-1'>
                {supplier.name}
              </td>
              <td className='border border-gray-300 px-2 py-1'>
                {supplier.contactDetail?.email}
              </td>
              <td className='border border-gray-300 px-2 py-1'>
                {supplier.contactDetail?.phone}
              </td>
              <td className='border border-gray-300 px-2 py-1'>
                {supplier.country}
              </td>
              <td className='border border-gray-300 px-2 py-1'>
                {supplier.taxCode}
              </td>
              <td className='border border-gray-300 px-2 py-1'>
                <button
                  className='bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mr-2'
                  onClick={() => openEditModal(supplier)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='mt-4'>
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          onClick={openAddModal}>
          Add Supplier
        </button>
      </div>
      {isModalOpen && (
        <SupplierModal
          onClose={() => setModalOpen(false)}
          onSave={currentSupplier ? handleEditSupplier : handleAddSupplier}
          initialData={currentSupplier}
        />
      )}
    </div>
  );
};

export default SuppliersPage;
