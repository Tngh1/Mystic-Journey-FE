"use client";

import { useState, ComponentProps, ReactNode } from "react";

interface DownloadButtonProps extends Omit<ComponentProps<"a">, "href" | "children" | "className"> {
  href: string;
  idleLabel?: ReactNode;
  doneLabel?: ReactNode;
  // Supported player classes: Knight, Archer, or Mage; the class selects base stats, compatible skills, skins, and combat scaling.
  className?: string;
}

// Renders the download button reusable UI component.
// Features: applies customizable style variants and responsive CSS classes; binds user interaction event listeners.
// Returns the styled JSX element.
export default function DownloadButton({
  href,
  idleLabel = "Download",
  doneLabel = "Open",
  className = "",
  ...anchorProps
}: DownloadButtonProps) {
  const [checked, setChecked] = useState(false);  // Initialize boolean flag as inactive

  // Event handler for handle download.
  const handleDownload = () => {
    if (!checked) {
      setChecked(true);
      if (href.startsWith("http")) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        const link = document.createElement("a");
        link.href = href;
        link.download = "MysticJourney_v1.0.zip";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    }
  };

  return (
    <div className={`db-container ${className}`.trim()}>
      <label className="db-label">
        <input
          type="checkbox"
          className="db-input"
          checked={checked}
          onChange={handleDownload}
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
          href={href}
          download="MysticJourney_v1.0.zip"
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
