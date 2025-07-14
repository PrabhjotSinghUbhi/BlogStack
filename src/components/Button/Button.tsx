import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

function Button({
  children,
  type = "button",
  bgColor = "bg-blue-600",
  textColor = "text-white",
  className = "",
  ...props
}: Readonly<ButtonProps>) {
  return (
    <button
      className={`px-4 py-2 ${bgColor} ${textColor} ${className}`}
      {...props}
      type={type}
    >
      {children}
    </button>
  );
}

export default Button;
