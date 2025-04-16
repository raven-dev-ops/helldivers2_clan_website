// src/app/(main)/forum/[categoryId]/page.tsx

interface CategoryPageProps {
    params: {
      categoryId: string;
    };
  }
  
  export default function CategoryPage({ params }: CategoryPageProps) {
    const { categoryId } = params;
  
    return (
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Forum Category: {categoryId}</h1>
        <p>Threads in category {categoryId} will be shown here.</p>
      </main>
    );
  }
  