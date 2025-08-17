'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styles from './MerchPage.module.css';

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

// --- Helper ---
function decodeHtmlEntities(text: string): string {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// --- Server Component ---
export default async function DuneMerchPage() {
  const token = process.env.STOREFRONT_API_TOKEN;
  let products: Product[] = [];
  let errorOccurred = false;
  let errorMessage = 'Failed to load products.';

  if (!token) {
    console.error('❌ STOREFRONT_API_TOKEN not set.');
    errorOccurred = true;
    errorMessage = 'Store config error. Please contact support.';
  }

  if (!errorOccurred) {
    try {
      console.log('🔍 Fetching collections...');
      const colRes = await fetch(
        `https://storefront-api.fourthwall.com/v1/collections?storefront_token=${token}`,
        { next: { revalidate: 3600 } }
      );
      if (!colRes.ok) {
        console.error(`❌ Collections fetch failed: ${colRes.status}`);
        throw new Error(`Collections fetch failed: ${colRes.status}`);
      }
      const colData = await colRes.json();
      const collections: Collection[] = colData.results || [];
      console.log(`✅ Found ${collections.length} collections.`);

      const targetCollectionSlug = 'all'; // Or set your specific slug
      const targetCollection =
        collections.find((c) => c.slug === targetCollectionSlug) ||
        collections[0] ||
        null;

      if (!targetCollection) {
        console.warn(`⚠️ No collection found.`);
      } else {
        console.log(`🔍 Fetching products for: ${targetCollection.name}`);
        const prodRes = await fetch(
          `https://storefront-api.fourthwall.com/v1/collections/${targetCollection.slug}/products?storefront_token=${token}`,
          { next: { revalidate: 3600 } }
        );
        if (!prodRes.ok) {
          console.error(`❌ Products fetch failed: ${prodRes.status}`);
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

        console.log(`✅ Fetched ${products.length} valid products.`);
      }
    } catch (err: unknown) {
      console.error('❌ Fetch error:', err);
      errorOccurred = true;
      errorMessage = 'An error occurred while loading products.';
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.merchContentContainer}>
        <div className={styles.titleCard}>
          <h1 className={styles.merchPageTitle}>GPT Dune: Awakening Shop</h1>
        </div>

        {errorOccurred ? (
          <div className={styles.merchErrorText}>{errorMessage}</div>
        ) : products.length === 0 ? (
          <div className={styles.merchMessageText}>No products found.</div>
        ) : (
          <div className={styles.productListContainer}>
            {products.map((product, index) => {
              const firstVariant = product.variants[0];
              const priceInfo = firstVariant?.unitPrice;
              let formattedPrice = '';
              if (priceInfo) {
                try {
                  formattedPrice = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: priceInfo.currency,
                  }).format(priceInfo.value);
                } catch {
                  formattedPrice = `$${priceInfo.value.toFixed(2)} ${priceInfo.currency}`;
                }
              }

              const imageUrl = product.images?.[0]?.url;
              const cleanDescription =
                decodeHtmlEntities(product.description).replace(
                  /<[^>]*>?/gm,
                  ''
                ) || 'No description available.';

              return (
                <Link
                  key={product.id}
                  href={`https://gptfleet-shop.fourthwall.com/products/${product.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.productCardLink}
                  title={`View ${product.name}`}
                >
                  <div className={styles.imageContainer}>
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={
                          product.images?.[0]?.altText ||
                          product.name ||
                          'Product'
                        }
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className={styles.productImage}
                        priority={index < 4}
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className={styles.merchImagePlaceholder}>
                        No Image
                      </div>
                    )}
                  </div>
                  <div className={styles.detailsContainer}>
                    <h2 className={styles.productName}>{product.name}</h2>
                    <p className={styles.productDescription}>
                      {cleanDescription}
                    </p>
                    {formattedPrice && (
                      <p className={styles.productPrice}>{formattedPrice}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
