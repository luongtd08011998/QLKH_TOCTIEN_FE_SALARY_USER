import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
    Plus,
    Pencil,
    Trash2,
    Upload,
    Eye,
    Mail,
    SendHorizonal,
    X,
    CircleCheck,
    CircleAlert,
} from "lucide-react";
import { useSalaries } from "../hooks/useSalaries";
import { useDeleteSalary } from "../hooks/useDeleteSalary";
import { useSendSalaryEmail } from "../hooks/useSendSalaryEmail";
import { useSendAllSalaryEmails } from "../hooks/useSendAllSalaryEmails";
import { DataTable } from "@/components/common/DataTable";
import { SearchBar } from "@/components/common/SearchBar";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { AccessDenied } from "@/components/common/AccessDenied";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { SalaryForm } from "./SalaryForm";
import { SalaryImportModal } from "./SalaryImportModal";
import { SalarySlipModal } from "./SalarySlipModal";
import { is403Error } from "@/utils/is403Error";
import type { SalaryResponse, SalarySendStatus } from "../types";
import dayjs from "dayjs";

const columnHelper = createColumnHelper<SalaryResponse>();

function previewText(s: string | null | undefined, max: number): string {
    if (!s) return "—";
    const t = s.replace(/\s+/g, " ").trim();
    return t.length <= max ? t : `${t.slice(0, max)}…`;
}

/** Modal chọn kỳ lương để gửi hàng loạt */
function SendAllModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [yearMonth, setYearMonth] = useState("");
    const [sendScope, setSendScope] = useState<"" | "UNSENT" | "FAILED">("");
    const sendAll = useSendAllSalaryEmails();

    function handleClose() {
        sendAll.reset();
        setYearMonth("");
        setSendScope("");
        onClose();
    }

    function handleSend() {
        if (!yearMonth) return;
        const ym = yearMonth.replace("-", ""); // "2025-02" → "202502"
        sendAll.mutate({
            yearMonth: ym,
            sendStatus: sendScope || undefined,
        });
    }

    const batch = sendAll.isSuccess ? sendAll.data?.data : undefined;
    const successes = batch?.successes ?? [];
    const errors = batch?.errors ?? [];

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Gửi phiếu lương hàng loạt" size="lg">
            <div className="space-y-4">
                <p className="text-sm text-slate-600">
                    Chọn kỳ lương. Hệ thống sẽ gửi email cho tất cả nhân viên có địa chỉ email trong kỳ đó.
                </p>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Kỳ lương <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="month"
                        value={yearMonth}
                        onChange={(e) => setYearMonth(e.target.value)}
                        disabled={sendAll.isPending}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                <Select
                    label="Phạm vi gửi"
                    value={sendScope}
                    onChange={(e) => setSendScope(e.target.value as "" | "UNSENT" | "FAILED")}
                    disabled={sendAll.isPending}
                    options={[
                        { label: "Chưa gửi + Thất bại (mặc định)", value: "" },
                        { label: "Chỉ chưa gửi (UNSENT)", value: "UNSENT" },
                        { label: "Chỉ thất bại (FAILED)", value: "FAILED" },
                    ]}
                />

                {sendAll.isSuccess && batch != null && (
                    <div className="space-y-3 text-sm">
                        <p className="text-slate-700 font-medium">
                            Kết quả:{" "}
                            <span className="text-emerald-700">{batch.successCount} thành công</span>
                            {", "}
                            <span className="text-amber-800">{batch.failCount} thất bại</span>
                        </p>

                        {successes.length > 0 && (
                            <div
                                className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900
                                           space-y-1 max-h-44 overflow-y-auto"
                            >
                                <p className="font-semibold flex items-center gap-1.5">
                                    <CircleCheck className="w-3.5 h-3.5 shrink-0" />
                                    Đã gửi tới ({successes.length})
                                </p>
                                <ul className="list-disc pl-4 space-y-0.5">
                                    {successes.map((line, i) => (
                                        <li key={i} className="break-all">
                                            {line}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {errors.length > 0 && (
                            <div
                                className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900
                                           space-y-1 max-h-44 overflow-y-auto"
                            >
                                <p className="font-semibold flex items-center gap-1.5">
                                    <CircleAlert className="w-3.5 h-3.5 shrink-0" />
                                    Thất bại / bỏ qua ({errors.length})
                                </p>
                                <ul className="list-disc pl-4 space-y-0.5">
                                    {errors.map((e, i) => (
                                        <li key={i} className="break-all">
                                            {e}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="secondary" type="button" onClick={handleClose}>
                        <X className="w-4 h-4" />
                        Đóng
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSend}
                        disabled={!yearMonth || sendAll.isPending}
                    >
                        <SendHorizonal className="w-4 h-4" />
                        {sendAll.isPending ? "Đang gửi..." : "Gửi tất cả"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export function SalaryListPage() {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState("");
    const [sendStatus, setSendStatus] = useState<SalarySendStatus | "">("");
    const [showForm, setShowForm] = useState(false);
    const [showImport, setShowImport] = useState(false);
    const [showSlip, setShowSlip] = useState(false);
    const [showSendAll, setShowSendAll] = useState(false);
    const [editSalary, setEditSalary] = useState<SalaryResponse | null>(null);
    const [previewSalary, setPreviewSalary] = useState<SalaryResponse | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [sendingId, setSendingId] = useState<number | null>(null);

    const { data, isLoading, error } = useSalaries({
        page,
        size,
        ...(sendStatus ? { sendStatus } : {}),
    });
    const deleteSalary = useDeleteSalary();
    const sendEmail = useSendSalaryEmail();

    if (is403Error(error)) {
        return <AccessDenied />;
    }

    const columns = [
        columnHelper.accessor("yearMonth", {
            header: "Kỳ",
            cell: (info) => (
                <span className="font-medium text-slate-900">{info.getValue()}</span>
            ),
        }),
        columnHelper.accessor("employeeId", {
            header: "Mã NV",
            cell: (info) => previewText(info.getValue(), 24),
        }),
        columnHelper.accessor("workingDay", {
            header: "Ngày công",
            cell: (info) => {
                const v = info.getValue();
                return v == null ? "—" : String(v);
            },
        }),
        columnHelper.accessor("netAmount", {
            header: "Thực lĩnh",
            cell: (info) => previewText(info.getValue(), 32),
        }),
        columnHelper.accessor("reserve1", {
            header: "Trạng thái gửi",
            cell: (info) => {
                const v = (info.getValue() ?? "").trim().toUpperCase();
                if (v === "SENT") {
                    return (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-xs">
                            Đã gửi
                        </span>
                    );
                }
                if (v === "FAILED") {
                    return (
                        <span className="inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-xs">
                            Thất bại
                        </span>
                    );
                }
                return (
                    <span className="inline-flex items-center rounded-full bg-slate-50 text-slate-700 border border-slate-200 px-2 py-0.5 text-xs">
                        Chưa gửi
                    </span>
                );
            },
        }),
        columnHelper.accessor("modifiedDate", {
            header: "Cập nhật",
            cell: (info) => {
                const v = info.getValue();
                return v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "—";
            },
        }),
        columnHelper.display({
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <div className="flex items-center gap-1 justify-end">
                    {/* Xem phiếu lương */}
                    <button
                        type="button"
                        title="Xem phiếu lương"
                        onClick={() => {
                            setPreviewSalary(row.original);
                            setShowSlip(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                    </button>

                    {/* Gửi email */}
                    <button
                        type="button"
                        title="Gửi phiếu lương qua email"
                        disabled={
                            sendEmail.isPending && sendingId === row.original.id
                        }
                        onClick={() => {
                            setSendingId(row.original.id);
                            sendEmail.mutate(row.original.id, {
                                onSettled: () => setSendingId(null),
                            });
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-40"
                    >
                        <Mail className="w-4 h-4" />
                    </button>

                    {/* Sửa */}
                    <button
                        type="button"
                        title="Sửa"
                        onClick={() => {
                            setEditSalary(row.original);
                            setShowForm(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>

                    {/* Xóa */}
                    <button
                        type="button"
                        title="Xóa"
                        onClick={() => setDeleteId(row.original.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        }),
    ];

    const rows = data?.data.result ?? [];
    const q = search.trim().toLowerCase();
    const filteredData = q
        ? rows.filter((row) => {
              const hay = [row.yearMonth, row.employeeId, row.netAmount, row.income]
                  .filter(Boolean)
                  .join(" ")
                  .toLowerCase();
              return hay.includes(q);
          })
        : rows;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Bảng lương</h1>
                    <p className="text-slate-500 mt-1">
                        Quản lý bảng lương theo kỳ (legacy salary)
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        onClick={() => setShowSendAll(true)}
                    >
                        <SendHorizonal className="w-4 h-4" />
                        Gửi tất cả
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setShowImport(true)}
                    >
                        <Upload className="w-4 h-4" />
                        Import Excel
                    </Button>
                    <Button
                        onClick={() => {
                            setEditSalary(null);
                            setShowForm(true);
                        }}
                    >
                        <Plus className="w-4 h-4" />
                        Thêm bảng lương
                    </Button>
                </div>
            </div>

            <div className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                        <SearchBar
                            value={search}
                            onChange={setSearch}
                            placeholder="Tìm theo kỳ, mã NV, thu nhập, thực lĩnh..."
                        />
                    </div>
                    <Select
                        label="Trạng thái gửi"
                        value={sendStatus}
                        onChange={(e) => {
                            setSendStatus(e.target.value as SalarySendStatus | "");
                            setPage(1);
                        }}
                        options={[
                            { label: "Tất cả", value: "" },
                            { label: "Chưa gửi (UNSENT)", value: "UNSENT" },
                            { label: "Đã gửi (SENT)", value: "SENT" },
                            { label: "Thất bại (FAILED)", value: "FAILED" },
                        ]}
                    />
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredData}
                meta={data?.data.meta}
                isLoading={isLoading}
                onPageChange={setPage}
                onPageSizeChange={setSize}
            />

            <SalaryForm
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false);
                    setEditSalary(null);
                }}
                salary={editSalary}
            />

            <SalaryImportModal
                isOpen={showImport}
                onClose={() => setShowImport(false)}
            />

            <SalarySlipModal
                isOpen={showSlip}
                onClose={() => {
                    setShowSlip(false);
                    setPreviewSalary(null);
                }}
                salary={previewSalary}
            />

            <SendAllModal
                isOpen={showSendAll}
                onClose={() => setShowSendAll(false)}
            />

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    if (deleteId) {
                        deleteSalary.mutate(deleteId, {
                            onSuccess: () => setDeleteId(null),
                        });
                    }
                }}
                message="Xóa dòng bảng lương này?"
                isLoading={deleteSalary.isPending}
            />
        </div>
    );
}

export const Component = SalaryListPage;
