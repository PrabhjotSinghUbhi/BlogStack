import { forwardRef, useId, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type: string;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, type = "text", className, ...props },
  ref
) {
  const id = useId();

  return (
    <div>
      {label && (
        <label htmlFor={id} className="inline-block mb-1 pl-1">
          {label}
        </label>
      )}

      <input
        id={id}
        ref={ref}
        type={type}
        className={` px-3 py-3 rounded-lg bg-white text-black outline:none focus:bg-gray-50
            border border-gray-200 w-full duration-200  ${className}`}
        {...props}
      />
    </div>
  );
});

export default Input;
