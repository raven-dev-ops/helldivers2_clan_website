'use client';

import { useId, useState, type CSSProperties, type ReactNode } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import styles from './Expanders.module.css';

type ExpanderProps = {
  id: string;                        // anchor id on the container
  title: ReactNode;                  // header content (string or node)
  titleClassName?: string;           // optional class for the title text (e.g., base.subHeading)
  children: ReactNode;               // content
  defaultExpanded?: boolean;
  className?: string;                // extra class for container
  style?: CSSProperties;             // e.g., { scrollMarginTop: 96 }
};

export default function Expander({
  id,
  title,
  titleClassName,
  children,
  defaultExpanded = false,
  className,
  style,
}: ExpanderProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const contentId = useId().replace(/:/g, '') + '-content'; // stable-ish id

  return (
    <div id={id} className={`${styles.challengeLevelContainer} ${className ?? ''}`} style={style}>
      <button
        type="button"
        className={`${styles.challengeHeader} ${!expanded ? styles.noBorderBottom : ''}`}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={contentId}
      >
        {/* title */}
        <span className={titleClassName}>{title}</span>

        {/* chevron */}
        <FaChevronDown
          className={`${styles.expandIcon} ${expanded ? styles.rotated : ''}`}
          aria-hidden="true"
        />
      </button>

      <div
        id={contentId}
        className={`${styles.challengeDetailsContent} ${expanded ? styles.expanded : ''}`}
      >
        {children}
      </div>
    </div>
  );
}
