/**
 * JSON-LD helpers.
 *
 * Why a shared module: the product template already emitted complete Product
 * schema, but blog posts and category hubs shipped with nothing but the
 * Organization block inherited from Layout.astro. Google could not tell those
 * pages were articles or collection hubs.
 *
 * Rules:
 *  - `publisher` / `author` reference the Organization by @id instead of being
 *    duplicated, so every page resolves to the same entity graph.
 *  - Never invent dates: callers must pass real publication dates.
 */

export const SITE = 'https://toyfactoryglobal.com';
export const ORG_ID = `${SITE}/#organization`;

const abs = (p: string) => (p.startsWith('http') ? p : `${SITE}${p}`);

/** ISO date or ISO datetime — schema.org accepts either. */
export type IsoDate = string;

export interface BlogPostInput {
  slug: string;
  title: string;
  description: string;
  date: IsoDate;
  category: string;
  image: string;
}

export function blogPosting(post: BlogPostInput, dateModified?: IsoDate) {
  const url = `${SITE}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.description,
    image: [abs(post.image)],
    datePublished: post.date,
    dateModified: dateModified || post.date,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: post.category,
    inLanguage: 'en',
    isAccessibleForFree: true,
  };
}

export interface CollectionInput {
  /** Category display name, e.g. "Track Toys". */
  name: string;
  slug: string;
  description: string;
  products: { id: string; name: string; image: string }[];
}

export function collectionPage(cat: CollectionInput) {
  const url = `${SITE}/category/${cat.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name: `${cat.name} Wholesale`,
    description: cat.description,
    isPartOf: { '@type': 'WebSite', '@id': `${SITE}/#website` },
    about: { '@id': ORG_ID },
    inLanguage: 'en',
    mainEntity: {
      '@type': 'ItemList',
      '@id': `${url}#itemlist`,
      name: `${cat.name} — wholesale catalog`,
      numberOfItems: cat.products.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: cat.products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.name,
        url: `${SITE}/product/${p.id}`,
        image: abs(p.image),
      })),
    },
  };
}

/** Home > Collection. Pass the leaf name + slug. */
export function categoryBreadcrumb(name: string, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: `${name} Wholesale`, item: `${SITE}/category/${slug}` },
    ],
  };
}

export function blogBreadcrumb(title: string, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
      { '@type': 'ListItem', position: 3, name: title, item: `${SITE}/blog/${slug}` },
    ],
  };
}
