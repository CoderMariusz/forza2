import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('expiredDateMethod').title('Expired Date Methods'),
      S.documentTypeListItem('supplier').title('Supplier'),
      S.documentTypeListItem('item').title('Item'),
      S.documentTypeListItem('po').title('Purchase Orders')
    ]);
