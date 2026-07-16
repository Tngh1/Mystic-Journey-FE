import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonSize = "sm" | "md" | "lg";

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: ButtonSize;
}

/**
 * Button with arrow-swap hover animation.
 * - Default: right arrow visible at right edge, left arrow parked off the left edge
 * - Hover: left arrow slides in from the left, right arrow slides out to the right,
 *          text nudges right, ring expands and fills, radius softens to pill-to-square
 */
export default function AnimatedButton({
  children,
  size = "md",
  className = "",
  ...props
}: AnimatedButtonProps) {
  return (
    <button
      className={`ab ab--${size} ${className}`.trim()}
      {...props}
    >
      <span className="ab__label">{children}</span>
      <span className="ab__fill" aria-hidden="true" />
      <svg
        className="ab__arrow ab__arrow--enter"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
      <svg
        className="ab__arrow ab__arrow--exit"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
    </button>
  );
}