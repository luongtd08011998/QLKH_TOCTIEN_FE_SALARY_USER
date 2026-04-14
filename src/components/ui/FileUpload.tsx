import { useState, useRef } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { useUploadFile } from "@/features/file/hooks/useUploadFile";
import { API_BASE_URL } from "@/config/constants";

interface FileUploadProps {
    label: string;
    folder: "avatars" | "logos";
    /** Current file name (from API), e.g. "avatar-123.png" */
    value?: string;
    /** Called with the uploaded fileName on success */
    onChange: (fileName: string) => void;
}

export function FileUpload({ label, folder, value, onChange }: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const upload = useUploadFile();
    const [preview, setPreview] = useState<string | null>(null);

    // Build the URL to display: either a local preview or the remote file
    const displayUrl =
        preview ??
        (value
            ? `${API_BASE_URL.replace("/api/v1", "")}/uploads/${folder}/${value}`
            : null);

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show local preview immediately
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Upload
        upload.mutate(
            { file, folder },
            {
                onSuccess: (res) => {
                    onChange(res.data.fileName);
                },
                onError: () => {
                    setPreview(null);
                },
            },
        );

        // Reset input so the same file can be re-selected
        e.target.value = "";
    }

    function handleRemove() {
        setPreview(null);
        onChange("");
    }

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
                {label}
            </label>

            {displayUrl ? (
                <div className="relative group w-24 h-24">
                    <img
                        src={displayUrl}
                        alt={label}
                        className="w-24 h-24 rounded-xl object-cover border border-slate-200"
                    />
                    {upload.isPending && (
                        <div className="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary-400 hover:bg-primary-50/50 text-slate-400 hover:text-primary-600 transition-colors cursor-pointer"
                >
                    {upload.isPending ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                <ImageIcon className="w-5 h-5" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium">
                                    Click to upload
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    PNG, JPG, GIF or WebP
                                </p>
                            </div>
                        </>
                    )}
                </button>
            )}

            {upload.isError && (
                <p className="text-xs text-red-600">
                    Upload failed. Please try again.
                </p>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* If there's an image displayed, allow re-upload */}
            {displayUrl && !upload.isPending && (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors mt-1"
                >
                    <Upload className="w-3.5 h-3.5" />
                    Change image
                </button>
            )}
        </div>
    );
}
