import { defineField, defineType } from 'sanity';

export const purchaseOrderType = defineType({
  name: 'purchaseOrder',
  title: 'Purchase Order',
  type: 'document',
  fields: [
    defineField({
      name: 'poNumber',
      title: 'PO Number',
      type: 'string',
      description: 'Unique identifier for the purchase order.',
      validation: (Rule) =>
        Rule.required()
          .min(3)
          .max(15)
          .error('PO Number must be between 3 and 15 characters.')
    }),
    defineField({
      name: 'supplier',
      title: 'Supplier',
      type: 'reference',
      to: [{ type: 'supplier' }],
      description: 'The supplier associated with this purchase order.',
      validation: (Rule) => Rule.required().error('Supplier is required.')
    }),
    defineField({
      name: 'deliveryDate',
      title: 'Delivery Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD'
      },
      description: 'The expected delivery date of the order.',
      validation: (Rule) => Rule.required().error('Delivery Date is required.')
    }),
    defineField({
      name: 'createdBy',
      title: 'Created By',
      type: 'string',
      description: 'The user who created this purchase order.',
      validation: (Rule) =>
        Rule.required().error('Created By field is required.')
    }),
    defineField({
      name: 'creationDate',
      title: 'Creation Date',
      type: 'datetime',
      description: 'The timestamp when the purchase order was created.',
      validation: (Rule) => Rule.required().error('Creation Date is required.')
    })
  ]
});
