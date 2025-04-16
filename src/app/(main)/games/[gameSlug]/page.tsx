// src/app/(main)/games/[gameSlug]/page.tsx

interface GamePageProps {
  params: {
    gameSlug: string;
  };
}

export default function GamePage({ params }: GamePageProps) {
  const { gameSlug } = params;

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Game: {gameSlug}</h1>
      <p>Details about {gameSlug} go here.</p>
    </main>
  );
}
