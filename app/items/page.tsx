'use client';
import React, { useState } from 'react';
import MaterialModal from './addItem';

interface Material {
  itemNumber: string;
  name: string;
  price: number;
  measureUnit: string;
  expirationMethod: string;
  supplier: string;
}

const MaterialsPage = () => {
  const [materials, setMaterials] = useState<Material[]>([
    {
      itemNumber: 'MAT001',
      name: 'Material A',
      price: 10.0,
      measureUnit: 'kg',
      expirationMethod: 'Provided',
      supplier: 'Supplier A'
    },
    {
      itemNumber: 'MAT002',
      name: 'Material B',
      price: 15.5,
      measureUnit: 'liters',
      expirationMethod: 'From Delivery Date',
      supplier: 'Supplier B'
    }
  ]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);

  const handleAddMaterial = (material: Material) => {
    if (materials.some((m) => m.itemNumber === material.itemNumber)) {
      alert('Item number already exists. Please choose another.');
      return;
    }
    setMaterials((prev) => [...prev, material]);
    setModalOpen(false);
  };

  const handleEditMaterial = (updatedMaterial: Material) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.itemNumber === updatedMaterial.itemNumber ? updatedMaterial : m
      )
    );
    setModalOpen(false);
  };

  const openAddModal = () => {
    setCurrentMaterial(null);
    setModalOpen(true);
  };

  const openEditModal = (material: Material) => {
    setCurrentMaterial(material);
    setModalOpen(true);
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Materials</h1>
      <table className='table-auto w-full border-collapse border border-gray-300'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='border border-gray-300 px-4 py-2'>Item Number</th>
            <th className='border border-gray-300 px-4 py-2'>Name</th>
            <th className='border border-gray-300 px-4 py-2'>Price</th>
            <th className='border border-gray-300 px-4 py-2'>Measure Unit</th>
            <th className='border border-gray-300 px-4 py-2'>
              Expiration Method
            </th>
            <th className='border border-gray-300 px-4 py-2'>Supplier</th>
            <th className='border border-gray-300 px-4 py-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr key={material.itemNumber}>
              <td className='border border-gray-300 px-4 py-2'>
                {material.itemNumber}
              </td>
              <td className='border border-gray-300 px-4 py-2'>
                {material.name}
              </td>
              <td className='border border-gray-300 px-4 py-2'>
                {material.price}
              </td>
              <td className='border border-gray-300 px-4 py-2'>
                {material.measureUnit}
              </td>
              <td className='border border-gray-300 px-4 py-2'>
                {material.expirationMethod}
              </td>
              <td className='border border-gray-300 px-4 py-2'>
                {material.supplier}
              </td>
              <td className='border border-gray-300 px-4 py-2'>
                <button
                  className='bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mr-2'
                  onClick={() => openEditModal(material)}>
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
          Add Material
        </button>
      </div>
      {isModalOpen && (
        <MaterialModal
          existingMaterials={materials}
          onClose={() => setModalOpen(false)}
          onSave={currentMaterial ? handleEditMaterial : handleAddMaterial}
          initialData={currentMaterial}
        />
      )}
    </div>
  );
};

export default MaterialsPage;
