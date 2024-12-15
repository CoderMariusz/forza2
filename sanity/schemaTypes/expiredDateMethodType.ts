import { defineField, defineType } from 'sanity';

export const expiredDateMethodType = defineType({
  name: 'expiredDateMethod',
  title: 'Expired Date Method',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description:
        'The name of the expiration method (e.g., Provided, From Delivery Date, From Production Date).',
      validation: (Rule) => Rule.required().error('Name is required.')
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A brief explanation of the expiration method.',
      validation: (Rule) =>
        Rule.max(200).warning('Description should not exceed 200 characters.')
    })
  ]
});
