// src/app/(main)/forum/[categoryId]/[threadId]/page.tsx

interface ThreadPageProps {
    params: {
      categoryId: string;
      threadId: string;
    };
  }
  
  export default function ThreadPage({ params }: ThreadPageProps) {
    const { categoryId, threadId } = params;
  
    return (
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">
          Thread: {threadId} (Category: {categoryId})
        </h1>
        <p>Forum posts will be shown here.</p>
      </main>
    );
  }
  