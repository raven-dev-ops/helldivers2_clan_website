'use client';

import Link from 'next/link';
import type { ComponentProps, PropsWithChildren } from 'react';

type NoPrefetchLinkProps = PropsWithChildren<ComponentProps<typeof Link>>;

export default function NoPrefetchLink({ children, ...props }: NoPrefetchLinkProps) {
  return (
    <Link prefetch={false} {...props}>
      {children}
    </Link>
  );
}
