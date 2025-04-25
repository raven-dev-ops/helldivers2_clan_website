// src/app/(main)/helldivers-2/merch/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// --- Type Definitions (Remain the same) ---
type ProductVariant = {
  id: string;
  name?: string;
  options?: { id: string; name: string }[];
  unitPrice: {
    value: number; // Assume this is now in MAJOR units (e.g., dollars)
    currency: string;
  };
};

type ProductImage = {
  id: string;
  url: string;
  altText?: string;
};

type Product = {
  id: string;
  name: string;
  description: string; // Raw HTML/text from API
  slug: string;
  images: ProductImage[];
  variants: ProductVariant[];
};

type Collection = {
    id: string;
    name: string;
    slug: string;
};

// --- Style Object (Remains the same) ---
const styles: { [key: string]: React.CSSProperties } = {
  mainContainer: { maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem', fontFamily: 'var(--font-sans, sans-serif)', },
  pageTitle: { fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', color: 'var(--color-primary, #facc15)', },
  productListContainer: { display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', },
  productCardLink: { display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-surface, #ffffff)', borderRadius: 'var(--border-radius-lg, 8px)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden', border: '1px solid var(--color-border, #e0e0e0)', textDecoration: 'none', color: 'inherit', flex: '1 1 300px', maxWidth: '350px', transition: 'box-shadow 0.3s ease-in-out', },
  imageContainer: { position: 'relative', width: 'F0%', aspectRatio: '1 / 1', overflow: 'hidden', },
  productImage: { objectFit: 'cover', },
  imagePlaceholder: { width: '100%', aspectRatio: '1 / 1', backgroundColor: 'var(--color-surface-alt, #f0f0f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted, #999)', },
  detailsContainer: { padding: '1rem', display: 'flex', flexDirection: 'column', flexGrow: 1, },
  productName: { fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-primary, #333)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', },
  productDescription: { fontSize: '0.9rem', color: 'var(--color-text-secondary, #666)', marginBottom: '1rem', flexGrow: 1, lineHeight: 1.5, maxHeight: '4.5em', overflow: 'hidden', whiteSpace: 'pre-line' /* Render newlines if present after tag stripping */ },
  productPrice: { fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-text-primary, #333)', marginTop: 'auto', },
  messageText: { textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-text-secondary, #666)', fontSize: '1.1rem', },
  errorText: { textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-error, #dc2626)', fontSize: '1.1rem', fontWeight: 500, }
};

// --- Helper Function to Decode HTML Entities ---
// Note: This runs server-side, so window is not available. Basic replacement is used.
function decodeHtmlEntities(text: string): string {
  if (!text) return ''; // Handle null or undefined input

  // Replace entities one by one, ensuring the full entity is matched
  let decodedText = text;
  decodedText = decodedText.replace(/&/g, '&');  // Ampersand first
  decodedText = decodedText.replace(/</g, '<');
  decodedText = decodedText.replace(/>/g, '>');
  decodedText = decodedText.replace(/"/g, '"');
  decodedText = decodedText.replace(/'/g, "'"); // Numeric entity for single quote
  decodedText = decodedText.replace(/'/g, "'"); // Named entity for single quote
  // Add more replacements here if needed for other entities like  , etc.
  // decodedText = decodedText.replace(/ /g, ' ');

  return decodedText;
}

// --- Server Component ---
export default async function HelldiversMerchPage() {
  const token = process.env.STOREFRONT_API_TOKEN;
  let products: Product[] = [];
  let errorOccurred = false;
  let errorMessage = 'Failed to load products.';

  if (!token) {
    console.error('Error: STOREFRONT_API_TOKEN environment variable is not set.');
    errorOccurred = true;
    errorMessage = 'Store configuration error. Please contact support.';
  }

  if (!errorOccurred) {
      try {
        console.log('Fetching collections...');
        const colRes = await fetch(
          `https://storefront-api.fourthwall.com/v1/collections?storefront_token=${token}`,
          { next: { revalidate: 60 } }
        );
        if (!colRes.ok) throw new Error(`Collections fetch failed: ${colRes.status} ${colRes.statusText}`);
        const colData = await colRes.json();
        const collections: Collection[] = colData.results || [];
        console.log(`Found ${collections.length} collections.`);

        const targetCollectionSlug = 'all'; // ** CHANGE IF NEEDED **
        const targetCollection = collections.find(col => col.slug === targetCollectionSlug) || (collections.length > 0 ? collections[0] : null);

        if (!targetCollection) {
             console.warn('No target collection found.');
        } else {
          console.log(`Fetching products for collection: ${targetCollection.name} (slug: ${targetCollection.slug})...`);
          const prodRes = await fetch(
            `https://storefront-api.fourthwall.com/v1/collections/${targetCollection.slug}/products?storefront_token=${token}`,
            { next: { revalidate: 60 } }
          );
          if (!prodRes.ok) throw new Error(`Products fetch failed: ${prodRes.status} ${prodRes.statusText}`);
          const prodData = await prodRes.json();
          products = prodData.results || [];
          console.log(`Fetched ${products.length} products.`);
        }
      } catch (err: unknown) {
        // ... (error handling remains the same)
        if (err instanceof Error) {
            console.error('Error fetching Fourthwall products:', err.message);
            errorMessage = `Failed to load products. Please try again later.`;
        } else {
            console.error('An unexpected error occurred:', err);
            errorMessage = 'An unexpected error occurred.';
        }
        errorOccurred = true;
      }
  }

  // --- Render the UI ---
  return (
    <main style={styles.mainContainer}>
      <h1 style={styles.pageTitle}>
      </h1>

      {errorOccurred ? (
        <div style={styles.errorText}>{errorMessage}</div>
      ) : products.length === 0 ? (
        <div style={styles.messageText}>No products available in this collection.</div>
      ) : (
        <div style={styles.productListContainer}>
          {products.map((product, index) => {
            // --- PRICE FIX ---
            let formattedPrice = '';
            if (product.variants?.[0]?.unitPrice) {
              const priceInfo = product.variants[0].unitPrice;
              // *** REMOVED division by 100 ***
              const priceValue = priceInfo.value;
              try {
                  formattedPrice = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: priceInfo.currency || 'USD',
                  }).format(priceValue); // Use the value directly
              } catch {
                  // Fallback using the raw value
                  formattedPrice = `$${priceValue.toFixed(2)} ${priceInfo.currency}`;
              }
            }

            const imageUrl = product.images?.[0]?.url;

            // --- DESCRIPTION FIX ---
            // Decode entities first, then strip tags (basic strip)
            const decodedDescription = product.description ? decodeHtmlEntities(product.description) : '';
            const cleanDescription = decodedDescription.replace(/<[^>]*>?/gm, '') || 'No description available.';

            return (
              <Link
                key={product.id}
                href={`https://gptfleet-shop.fourthwall.com/products/${product.slug}`} // Make sure URL is correct
                target="_blank" // Added target blank
                rel="noopener noreferrer"
                style={styles.productCardLink}
                title={`View ${product.name} in store`}
              >
                <div style={styles.imageContainer}>
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name || 'Product image'}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={styles.productImage}
                      priority={index < 4}
                    />
                  ) : (
                    <div style={styles.imagePlaceholder}>
                      No Image Available
                    </div>
                  )}
                </div>
                <div style={styles.detailsContainer}>
                  <h2 style={styles.productName} title={product.name}>
                    {product.name}
                  </h2>
                  {/* Use the cleaned and decoded description */}
                  <p style={styles.productDescription}>
                    {cleanDescription}
                  </p>
                  {formattedPrice && (
                    <p style={styles.productPrice}>
                      {formattedPrice}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}