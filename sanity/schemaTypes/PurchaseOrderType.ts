import { defineType, defineField } from 'sanity';

export const purchaseOrder = defineType({
  name: 'po',
  title: 'Purchase Order',
  type: 'document',
  fields: [
    defineField({
      name: 'PoNumber',
      title: 'PO Number',
      type: 'string',
      validation: (Rule) => Rule.required().error('PO Number is required.')
    }),
    defineField({
      name: 'supplier',
      title: 'Supplier',
      type: 'reference',
      to: [{ type: 'supplier' }],
      validation: (Rule) => Rule.required().error('Supplier is required.')
    }),
    defineField({
      name: 'deliveryDate',
      title: 'Delivery Date',
      type: 'date',
      validation: (Rule) => Rule.required().error('Delivery date is required.')
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'item',
              title: 'Item',
              type: 'reference',
              to: [{ type: 'item' }]
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: (Rule) =>
                Rule.required().min(1).error('Quantity must be at least 1.')
            },
            {
              name: 'status',
              title: 'Status',
              type: 'string',
              validation: (Rule) =>
                Rule.required().min(1).error('Status is required.')
            },
            {
              name: 'deliveryDateItem',
              title: 'Delivery date Item',
              type: 'date',
              validation: (Rule) =>
                Rule.required().min(1).error('Status is required.')
            }
          ]
        }
      ],
      validation: (Rule) =>
        Rule.required().min(1).error('At least one item must be added.')
    }),
    defineField({
      name: 'addBy',
      title: 'Added By',
      type: 'string',
      validation: (Rule) => Rule.required().error('User who added is required.')
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      validation: (Rule) => Rule.required()
    })
  ]
});
