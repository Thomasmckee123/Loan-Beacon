import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "cancel";

const variantStyles: Record<Variant, string> = {
  primary:
    "border border-transparent text-white bg-navy-800 hover:bg-navy-900 focus:ring-navy-500 shadow-sm",
  cancel:
    "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-navy-500 shadow-sm",
};

type BaseProps = {
  variant?: Variant;
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
};

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    href?: never;
  };

type ButtonAsLink = BaseProps & {
  href: string;
  type?: never;
  disabled?: never;
  onClick?: never;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button({
  variant = "primary",
  loading = false,
  loadingText,
  children,
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const className = `${base} ${variantStyles[variant]}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={className}>
        {children}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { href: _href, ...buttonProps } = props as ButtonAsButton;

  return (
    <button
      className={className}
      disabled={loading || buttonProps.disabled}
      {...buttonProps}
    >
      {loading ? loadingText ?? children : children}
    </button>
  );
}
