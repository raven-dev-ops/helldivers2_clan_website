// src/app/(main)/helldivers-2/merch/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// --- Type Definitions (Remain the same) ---
type ProductVariant = {
  id: string; name?: string; options?: { id: string; name: string }[];
  unitPrice: { value: number; currency: string; };
};
type ProductImage = { id: string; url: string; altText?: string; };
type Product = { id: string; name: string; description: string; slug: string; images: ProductImage[]; variants: ProductVariant[]; };
type Collection = { id: string; name: string; slug: string; };

// --- Helper Function to Decode HTML Entities (Remains the same) ---
function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  let decodedText = text;
  decodedText = decodedText.replace(/&/g, '&');
  decodedText = decodedText.replace(/</g, '<');
  decodedText = decodedText.replace(/>/g, '>');
  decodedText = decodedText.replace(/"/g, '"');
  decodedText = decodedText.replace(/'/g, "'");
  decodedText = decodedText.replace(/'/g, "'");
  return decodedText;
}

// --- Server Component (Data Fetching Logic Remains the Same) ---
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
          { next: { revalidate: 60 } } // Or cache: 'no-store'
        );
        if (!colRes.ok) throw new Error(`Collections fetch failed: ${colRes.status} ${colRes.statusText}`);
        const colData = await colRes.json();
        const collections: Collection[] = colData.results || [];
        console.log(`Found ${collections.length} collections.`);

        const targetCollectionSlug = 'all'; // ** CHANGE IF NEEDED **
        const targetCollection = collections.find(col => col.slug === targetCollectionSlug) || (collections.length > 0 ? collections[0] : null);

        if (!targetCollection) {
             console.warn('No target collection found or store has no collections.');
        } else {
          console.log(`Fetching products for collection: ${targetCollection.name} (slug: ${targetCollection.slug})...`);
          const prodRes = await fetch(
            `https://storefront-api.fourthwall.com/v1/collections/${targetCollection.slug}/products?storefront_token=${token}`,
            { next: { revalidate: 60 } } // Or cache: 'no-store'
          );
          if (!prodRes.ok) throw new Error(`Products fetch failed: ${prodRes.status} ${prodRes.statusText}`);
          const prodData = await prodRes.json();
          // Ensure data structure matches Product[] before assignment
          products = (prodData.results || []).map((p: any) => ({ // Add basic mapping/validation if API structure varies
              id: p.id,
              name: p.name,
              description: p.description,
              slug: p.slug,
              images: p.images || [],
              variants: p.variants || []
          }));
          console.log(`Fetched ${products.length} products.`);
        }
      } catch (err: unknown) {
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

  // --- Render the UI (Using CSS Classes) ---
  return (
    <main className="merch-main-container"> {/* Use class */}
      <h1 className="merch-page-title"> {/* Use class */}
        Helldivers 2 Division Merch
      </h1>

      {errorOccurred ? (
        <div className="merch-error-text">{errorMessage}</div> /* Use class */
      ) : products.length === 0 ? (
        <div className="merch-message-text">No products available in this collection.</div> /* Use class */
      ) : (
        <div className="merch-product-list-container"> {/* Use class */}
          {products.map((product, index) => {
            // Price calculation (remains same)
            let formattedPrice = '';
            if (product.variants?.[0]?.unitPrice) {
              const priceInfo = product.variants[0].unitPrice;
              const priceValue = priceInfo.value; // Assuming value is in major units
              try {
                  formattedPrice = new Intl.NumberFormat('en-US', {
                    style: 'currency', currency: priceInfo.currency || 'USD',
                  }).format(priceValue);
              } catch {
                  formattedPrice = `$${priceValue.toFixed(2)} ${priceInfo.currency}`;
              }
            }

            const imageUrl = product.images?.[0]?.url;
            const decodedDescription = product.description ? decodeHtmlEntities(product.description) : '';
            const cleanDescription = decodedDescription.replace(/<[^>]*>?/gm, '') || 'No description available.';

            return (
              <Link
                key={product.id}
                href={`https://gptfleet-shop.fourthwall.com/products/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="merch-product-card-link" // Use class
                title={`View ${product.name} in store`}
              >
                <div className="merch-image-container"> {/* Use class */}
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name || 'Product image'}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="merch-product-image" // Use class
                      priority={index < 4}
                    />
                  ) : (
                    <div className="merch-image-placeholder"> {/* Use class */}
                      No Image Available
                    </div>
                  )}
                </div>
                <div className="merch-details-container"> {/* Use class */}
                  <h2 className="merch-product-name" title={product.name}> {/* Use class */}
                    {product.name}
                  </h2>
                  <p className="merch-product-description"> {/* Use class */}
                    {cleanDescription}
                  </p>
                  {formattedPrice && (
                    <p className="merch-product-price"> {/* Use class */}
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