// src/app/(main)/profile/[userId]/page.tsx

interface UserProfilePageProps {
    params: {
      userId: string;
    };
  }
  
  export default function UserProfilePage({ params }: UserProfilePageProps) {
    const { userId } = params;
    return (
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Profile of User ID: {userId}</h1>
        <p>Display user details, posts, stats, etc. for {userId}.</p>
      </main>
    );
  }
  