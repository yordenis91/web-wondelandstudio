import type { StructureResolver } from 'sanity/structure';

/**
 * `pricingCatalog` es singleton (regla 2 de CLAUDE.md): un solo documento en todo el
 * dataset. Se le quita el botón de "crear nuevo" del tipo genérico y se reemplaza por un
 * único ítem fijo que siempre abre (o crea, la primera vez) el mismo `_id`.
 */
const PRICING_CATALOG_ID = 'pricingCatalog';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      S.listItem()
        .title('Catálogo de precios')
        .id(PRICING_CATALOG_ID)
        .child(S.document().schemaType('pricingCatalog').documentId(PRICING_CATALOG_ID)),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => item.getId() !== 'pricingCatalog'),
    ]);
