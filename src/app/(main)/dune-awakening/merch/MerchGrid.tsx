'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styles from './MerchPage.module.css';

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

// --- Client Component ---
export default function MerchGrid({
  products,
  errorOccurred,
  errorMessage,
}: {
  products: Product[];
  errorOccurred: boolean;
  errorMessage: string;
}) {
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
                      <div className={styles.merchImagePlaceholder}>No Image</div>
                    )}
                  </div>
                  <div className={styles.detailsContainer}>
                    <h2 className={styles.productName}>{product.name}</h2>
                    <p className={styles.productDescription}>{cleanDescription}</p>
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
