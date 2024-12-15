import { defineField, defineType } from 'sanity';

export const itemType = defineType({
  name: 'item',
  title: 'Item',
  type: 'document',
  fields: [
    defineField({
      name: 'itemNumber',
      title: 'Item Number',
      type: 'string',
      description: 'A unique identifier for the item.',
      validation: (Rule) =>
        Rule.required()
          .min(3)
          .max(10)
          .error('Item number must be between 3 and 10 characters.')
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'The name of the item.',
      validation: (Rule) => Rule.required().error('Name is required.')
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'The price of the item.',
      validation: (Rule) =>
        Rule.min(0).error('Price must be a positive number.')
    }),
    defineField({
      name: 'measureUnit',
      title: 'Measure Unit',
      type: 'string',
      options: {
        list: [
          { title: 'kg', value: 'kg' },
          { title: 'liters', value: 'liters' },
          { title: 'pieces', value: 'pieces' }
        ]
      },
      description: 'The unit of measurement for the item.',
      validation: (Rule) => Rule.required().error('Measure Unit is required.')
    }),
    defineField({
      name: 'expirationMethod',
      title: 'Expiration Method',
      type: 'reference',
      to: [{ type: 'expiredDateMethod' }],
      description: 'Select the method for expiration.',
      validation: (Rule) =>
        Rule.required().error('Expiration Method is required.')
    }),
    defineField({
      name: 'supplier',
      title: 'Supplier',
      type: 'reference',
      to: [{ type: 'supplier' }],
      description: 'Select the supplier for this item.',
      validation: (Rule) => Rule.required().error('Supplier is required.')
    })
  ]
});
