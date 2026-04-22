import { useRef, useState } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/utils/error";
import { toast } from "react-hot-toast";
import { employeeApi } from "../api";
import { useImportEmployees } from "../hooks/useImportEmployees";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const TEMPLATE_COLUMNS = "MaNV · HoVaTen · SoDienThoai · MaBangLuong · Ngach · Bac · Email";

export function EmployeeImportModal({ isOpen, onClose }: Props) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const importEmployees = useImportEmployees();

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        if (file && file.size > 10 * 1024 * 1024) {
            toast.error("File quá lớn (giới hạn 10 MB)");
            e.target.value = "";
            return;
        }
        setSelectedFile(file);
    }

    function handleSubmit() {
        if (!selectedFile) {
            toast.error("Vui lòng chọn file Excel");
            return;
        }

        importEmployees.mutate(
            { file: selectedFile },
            {
                onSuccess: (res) => {
                    const d = res.data as
                        | { importedCount: number; totalRows: number }
                        | undefined;
                    toast.success(
                        d ? `Import thành công ${d.importedCount}/${d.totalRows} dòng` : "Import thành công",
                    );
                    setSelectedFile(null);
                    onClose();
                },
                onError: (err) => {
                    toast.error(getErrorMessage(err, "Lỗi import Excel"), { duration: 8000 });
                },
            },
        );
    }

    async function handleDownloadTemplate() {
        try {
            const res = await employeeApi.downloadTemplate();
            const url = URL.createObjectURL(new Blob([res.data as BlobPart]));
            const a = document.createElement("a");
            a.href = url;
            a.download = "employee-import-template.xlsx";
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            toast.error("Không thể tải file mẫu");
        }
    }

    function handleClose() {
        setSelectedFile(null);
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Import nhân viên từ Excel" size="md">
            <div className="space-y-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">
                        File Excel (.xlsx) <span className="text-red-500">*</span>
                    </label>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    <div
                        className="flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors border-slate-300 hover:border-primary-400 hover:bg-primary-50"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <FileSpreadsheet className="w-8 h-8 shrink-0 text-green-600" />
                        <div className="min-w-0">
                            {selectedFile ? (
                                <>
                                    <p className="text-sm font-medium text-slate-800 truncate">
                                        {selectedFile.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {(selectedFile.size / 1024).toFixed(1)} KB — nhấn để đổi file
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-medium text-slate-600">
                                        Nhấn để chọn file Excel
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Chỉ chấp nhận .xlsx, tối đa 10 MB
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                    <p className="font-medium mb-1">Tên cột trong file mẫu:</p>
                    <p className="font-mono">{TEMPLATE_COLUMNS}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <button
                        type="button"
                        onClick={handleDownloadTemplate}
                        className="text-sm text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1"
                    >
                        <Upload className="w-3.5 h-3.5 rotate-180" />
                        Tải file mẫu
                    </button>

                    <div className="flex gap-2">
                        <Button variant="secondary" type="button" onClick={handleClose}>
                            Hủy
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            isLoading={importEmployees.isPending}
                            disabled={!selectedFile}
                        >
                            Ghi vào DB
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

