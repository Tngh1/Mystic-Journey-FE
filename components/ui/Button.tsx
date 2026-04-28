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
}

const BASE_CLASSES =
  "inline-flex items-center justify-center font-black tracking-widest uppercase transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

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
  className = "",
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
      {...props}
    >
      {children}
    </button>
  );
}
