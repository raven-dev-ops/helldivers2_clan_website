export async function GET(
  request: Request,
 context: { params: { userId: string } }
) {
  const { userId } = context.params;
  return new Response(JSON.stringify({ userId }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
