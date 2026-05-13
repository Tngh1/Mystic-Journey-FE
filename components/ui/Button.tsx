import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "outline" | "solid" | "cta" | "custom" | "hero";
type ButtonSize = "sm" | "md" | "lg";
type ButtonRounded = "full" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: ButtonRounded;
  children: ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
  loaderSize?: number;
  loaderBorder?: number;
}

const BASE_CLASSES =
  "inline-flex items-center justify-center font-black tracking-widest uppercase transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed gap-3";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  outline:
    "border-2 border-white text-white hover:bg-white hover:text-black",
  solid: "bg-white text-black hover:bg-gray-200",
  cta: "bg-[#5d9e6e] text-white hover:bg-[#4a8a5c]",
  custom: "",
  hero: "border-2 border-white text-white hover:bg-white hover:text-black hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]",
};

const ROUNDED_CLASSES: Record<ButtonRounded, string> = {
  full: "rounded-full",
  xl: "rounded-xl",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-5 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-10 py-4 text-base",
};

export default function Button({
  variant = "outline",
  size = "md",
  rounded = "full",
  children,
  fullWidth = false,
  isLoading = false,
  loaderSize = 20,
  loaderBorder = 3,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        BASE_CLASSES,
        VARIANT_CLASSES[variant],
        ROUNDED_CLASSES[rounded],
        SIZE_CLASSES[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin"
          width={loaderSize}
          height={loaderSize}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth={loaderBorder}
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && children}
    </button>
  );
}
