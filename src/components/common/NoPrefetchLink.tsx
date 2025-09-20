'use client';

import Link, { type LinkProps } from 'next/link';
import { type AnchorHTMLAttributes, type PropsWithChildren } from 'react';

// Anchor attributes except href (handled by LinkProps)
type AnchorExtras = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

type NoPrefetchLinkProps = PropsWithChildren<LinkProps & AnchorExtras>;

export default function NoPrefetchLink({
  children,
  prefetch: _prefetch,
  ...rest
}: NoPrefetchLinkProps) {
  return (
    <Link {...rest} prefetch={false}>
      {children}
    </Link>
  );
}
