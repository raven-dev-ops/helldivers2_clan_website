// src/app/(main)/helldivers-2/academy/page.tsx
'use client';

import base from '../HelldiversBase.module.css';

export default function AcademyPage() {
  return (
    <div className={base.wrapper}>
      <div className={base.dividerLayer} />
      <div className={base.pageContainer}>
        <section className={base.section}>
          <h2 className={base.sectionTitle}>Academy</h2>
          <p className={base.paragraph}>
            Welcome to the GPT Academy. Select a training module from the
            navigation.
          </p>
        </section>
      </div>
    </div>
  );
}
