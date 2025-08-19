import MerchGrid from './MerchGrid';
import { logger } from '@/lib/logger';

// ✅ Force dynamic rendering for fresh data
export const dynamic = 'force-dynamic';

// --- Types ---
type ProductVariant = {
  id: string;
  name?: string;
  options?: { id: string; name: string }[];
  unitPrice: { value: number; currency: string };
};

type ProductImage = { id: string; url: string; altText?: string };

type Product = {
  id: string;
  name: string;
  description: string;
  slug: string;
  images: ProductImage[];
  variants: ProductVariant[];
};

type Collection = { id: string; name: string; slug: string };

interface RawProductData {
  id?: string;
  name?: string;
  description?: string;
  slug?: string;
  images?: any[];
  variants?: any[];
}

// --- Server Component ---
export default async function DuneMerchPage() {
  const token = process.env.STOREFRONT_API_TOKEN;
  let products: Product[] = [];
  let errorOccurred = false;
  let errorMessage = 'Failed to load products.';

  if (!token) {
    logger.error('❌ STOREFRONT_API_TOKEN not set.');
    errorOccurred = true;
    errorMessage = 'Store config error. Please contact support.';
  }

  if (!errorOccurred) {
    try {
      logger.info('🔍 Fetching collections...');
      const colRes = await fetch(
        `https://storefront-api.fourthwall.com/v1/collections?storefront_token=${token}`,
        { next: { revalidate: 3600 } }
      );
      if (!colRes.ok) {
        logger.error(`❌ Collections fetch failed: ${colRes.status}`);
        throw new Error(`Collections fetch failed: ${colRes.status}`);
      }
      const colData = await colRes.json();
      const collections: Collection[] = colData.results || [];
      logger.info(`✅ Found ${collections.length} collections.`);

      const targetCollectionSlug = 'all'; // Or set your specific slug
      const targetCollection =
        collections.find((c) => c.slug === targetCollectionSlug) ||
        collections[0] ||
        null;

      if (!targetCollection) {
        logger.warn(`⚠️ No collection found.`);
      } else {
        logger.info(`🔍 Fetching products for: ${targetCollection.name}`);
        const prodRes = await fetch(
          `https://storefront-api.fourthwall.com/v1/collections/${targetCollection.slug}/products?storefront_token=${token}`,
          { next: { revalidate: 3600 } }
        );
        if (!prodRes.ok) {
          logger.error(`❌ Products fetch failed: ${prodRes.status}`);
          throw new Error(`Products fetch failed: ${prodRes.status}`);
        }

        const prodData = await prodRes.json();
        products = (prodData.results || [])
          .map(
            (p: RawProductData): Product => ({
              id:
                p?.id ||
                `unknown-${Math.random().toString(36).substring(2, 9)}`,
              name: p?.name || 'Unnamed Product',
              description: p?.description || '',
              slug: p?.slug || '',
              images: Array.isArray(p?.images)
                ? p.images
                    .map((img: any) => ({
                      id:
                        img?.id ||
                        `img-${Math.random().toString(36).substring(2, 9)}`,
                      url: img?.url || '',
                      altText: img?.altText || '',
                    }))
                    .filter((img) => img.url)
                : [],
              variants: Array.isArray(p?.variants)
                ? p.variants
                    .map((v: any) => ({
                      id:
                        v?.id ||
                        `var-${Math.random().toString(36).substring(2, 9)}`,
                      name: v?.name,
                      options: v?.options,
                      unitPrice: {
                        value:
                          typeof v?.unitPrice?.value === 'number'
                            ? v.unitPrice.value
                            : 0,
                        currency: v?.unitPrice?.currency || 'USD',
                      },
                    }))
                    .filter((v) => v.unitPrice.value > 0)
                : [],
            })
          )
          .filter(
            (p: Product): p is Product => !!p.slug && p.variants.length > 0
          );

        logger.info(`✅ Fetched ${products.length} valid products.`);
      }
    } catch (err: unknown) {
      logger.error('❌ Fetch error:', err);
      errorOccurred = true;
      errorMessage = 'An error occurred while loading products.';
    }
  }

  return (
    <MerchGrid
      products={products}
      errorOccurred={errorOccurred}
      errorMessage={errorMessage}
    />
  );
}
