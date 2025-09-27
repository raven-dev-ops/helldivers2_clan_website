'use client';
export default function GlobalError({ error }: { error: Error }) {
  return (
    <html>
      <body>
        <h2>Error: Something Went Wrong!</h2>
      </body>
    </html>
  );
}
