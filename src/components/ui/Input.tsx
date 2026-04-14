import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    function Input({ label, error, className = "", id, ...props }, ref) {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-slate-700"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`block w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus-ring ${error
                            ? "border-red-400 bg-red-50"
                            : "border-slate-300 bg-white hover:border-slate-400"
                        } ${className}`}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-red-600 mt-0.5">{error}</p>
                )}
            </div>
        );
    },
);
