import { defineField, defineType } from 'sanity';

export const supplierType = defineType({
  name: 'supplier',
  title: 'Supplier',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'The name of the supplier.',
      validation: (Rule) => Rule.required().error('Supplier name is required.')
    }),
    defineField({
      name: 'supplierCode',
      title: 'Supplier Code',
      type: 'string',
      description: 'A unique code for the supplier.',
      validation: (Rule) =>
        Rule.required()
          .min(3)
          .max(10)
          .error('Supplier code must be between 3 and 10 characters.')
    }),
    defineField({
      name: 'contactDetail',
      title: 'Contact Detail',
      type: 'object',
      fields: [
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: (Rule) =>
            Rule.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { name: 'email' }).error(
              'Please enter a valid email address.'
            )
        }),
        defineField({
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          description: 'The phone number of the supplier.',
          validation: (Rule) =>
            Rule.min(10)
              .max(15)
              .error('Phone number must be between 10 and 15 digits.')
        })
      ]
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      options: {
        list: [
          { title: 'United States', value: 'US' },
          { title: 'United Kingdom', value: 'UK' },
          { title: 'Canada', value: 'CA' },
          { title: 'Australia', value: 'AU' },
          { title: 'Germany', value: 'DE' }
          // Add more countries as needed
        ]
      },
      validation: (Rule) => Rule.required().error('Country is required.')
    }),
    defineField({
      name: 'taxCode',
      title: 'Tax Code',
      type: 'string',
      description: 'The tax identification code for the supplier.',
      validation: (Rule) => Rule.required().error('Tax code is required.')
    })
  ]
});
