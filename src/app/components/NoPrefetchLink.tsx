// src/app/components/NoPrefetchLink.tsx
"use client";
import Link from 'next/link';
export default function NoPrefetchLink(props: any) {
  return <Link prefetch={false} {...props} />;
}

