"use client";

import { useState, ComponentProps, ReactNode } from "react";

interface DownloadButtonProps extends Omit<ComponentProps<"a">, "href" | "children" | "className"> {
  href: string;
  idleLabel?: ReactNode;
  doneLabel?: ReactNode;
  /** Extra class on the outer container. */
  className?: string;
}

/**
 * Uiverse "install" button by Na3ar-17.
 * Controlled checkbox drives the CSS `:has(.db-input:checked)` selector.
 * Total animation length: 3.9s (3.5s install + 0.4s reveal), then opens `href`.
 */
export default function DownloadButton({
  href,
  idleLabel = "Download",
  doneLabel = "Open",
  className = "",
  ...anchorProps
}: DownloadButtonProps) {
  const [checked, setChecked] = useState(false);

  return (
    <div className={`db-container ${className}`.trim()}>
      <label className="db-label">
        <input
          type="checkbox"
          className="db-input"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <span className="db-circle">
          <svg
            className="db-icon"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M12 19V5m0 14-4-4m4 4 4-4"
            />
          </svg>
          <div className="db-square" />
        </span>
        <span className="db-title">{idleLabel}</span>
        <a
          className="db-title db-title--done"
          href={checked ? href : undefined}
          tabIndex={checked ? 0 : -1}
          aria-hidden={!checked}
          {...anchorProps}
        >
          {doneLabel}
        </a>
      </label>
    </div>
  );
}