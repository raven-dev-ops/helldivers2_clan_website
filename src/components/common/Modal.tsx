'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '@/styles/Modal.module.css';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  hero?: { src: string; alt: string; width?: number; height?: number };
  rightCta?: React.ReactNode; // e.g., “Apply to Mod Team” link
  children: React.ReactNode;  // modal body
};

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  hero,
  rightCta,
  children,
}: Props) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Prevent background scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev || ''; };
  }, [open]);

  // Focus trap (basic)
  useEffect(() => {
    if (!open || !modalRef.current) return;
    const el = modalRef.current;
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const getFocusable = () =>
      Array.from(el.querySelectorAll<HTMLElement>(selector))
        .filter((n) => !n.hasAttribute('disabled') && !n.getAttribute('aria-hidden'));
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const nodes = getFocusable();
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };
    el.addEventListener('keydown', onKeyDown as any);
    // focus first actionable element
    setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => el.removeEventListener('keydown', onKeyDown as any);
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose} data-modal-open>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        {hero && (
          <Image
            src={hero.src}
            alt={hero.alt}
            width={hero.width ?? 1200}
            height={hero.height ?? 675}
            className={styles.hero}
            priority
          />
        )}

        <div className={styles.header}>
          <div>
            <h3 id="modal-title" className={styles.title}>{title}</h3>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>

          <div className={styles.headerActions}>
            {rightCta}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className={styles.close}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
