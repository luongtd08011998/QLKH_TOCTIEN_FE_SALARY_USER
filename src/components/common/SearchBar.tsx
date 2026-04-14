import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    debounceMs?: number;
}

export function SearchBar({
    value,
    onChange,
    placeholder = "Search...",
    debounceMs = 400,
}: SearchBarProps) {
    const [localValue, setLocalValue] = useState(value);

    // Debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localValue !== value) {
                onChange(localValue);
            }
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [localValue, debounceMs, onChange, value]);

    // Sync external value
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder={placeholder}
                className="w-64 pl-9 pr-9 py-2 rounded-lg border border-slate-300 bg-white text-sm placeholder-slate-400 hover:border-slate-400 focus-ring transition-colors"
            />
            {localValue && (
                <button
                    onClick={() => {
                        setLocalValue("");
                        onChange("");
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    );
}
