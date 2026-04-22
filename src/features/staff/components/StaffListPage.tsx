import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { useStaffs } from "../hooks/useStaffs";
import { useDeleteStaff } from "../hooks/useDeleteStaff";
import { DataTable } from "@/components/common/DataTable";
import { SearchBar } from "@/components/common/SearchBar";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { AccessDenied } from "@/components/common/AccessDenied";
import { Button } from "@/components/ui/Button";
import { StaffForm } from "./StaffForm";
import { StaffImportModal } from "./StaffImportModal";
import { is403Error } from "@/utils/is403Error";
import type { StaffResponse } from "../types";

const columnHelper = createColumnHelper<StaffResponse>();

export function StaffListPage() {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editStaff, setEditStaff] = useState<StaffResponse | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [showImport, setShowImport] = useState(false);

    const { data, isLoading, error } = useStaffs({ page, size });
    const deleteStaff = useDeleteStaff();

    if (is403Error(error)) {
        return <AccessDenied />;
    }

    const columns = [
        columnHelper.accessor("fullName", {
            header: "Họ tên",
            cell: (info) => (
                <span className="font-medium text-slate-900">{info.getValue()}</span>
            ),
        }),
        columnHelper.accessor("email", {
            header: "Email",
            cell: (info) => info.getValue() ?? "—",
        }),
        columnHelper.accessor("userId", {
            header: "User ID",
            cell: (info) => (info.getValue() == null ? "—" : String(info.getValue())),
        }),
        columnHelper.accessor("isActive", {
            header: "Trạng thái",
            cell: (info) => {
                const v = info.getValue();
                if (!v) return "—";
                return v === "HOAT_DONG" ? "Hoạt động" : "Không hoạt động";
            },
        }),
        columnHelper.display({
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <div className="flex items-center gap-1 justify-end">
                    <button
                        type="button"
                        onClick={() => {
                            setEditStaff(row.original);
                            setShowForm(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
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
    const filteredData = search
        ? rows.filter(
              (s) =>
                  s.fullName.toLowerCase().includes(search.toLowerCase()) ||
                  (s.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
                  String(s.userId ?? "").includes(search),
          )
        : rows;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Nhân sự</h1>
                    <p className="text-slate-500 mt-1">Quản lý staff (legacy staff)</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => setShowImport(true)}>
                        <Upload className="w-4 h-4" />
                        Import Excel
                    </Button>
                    <Button
                        onClick={() => {
                            setEditStaff(null);
                            setShowForm(true);
                        }}
                    >
                        <Plus className="w-4 h-4" />
                        Thêm nhân sự
                    </Button>
                </div>
            </div>

            <div className="mb-4">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Tìm theo tên, email, userId..."
                />
            </div>

            <DataTable
                columns={columns}
                data={filteredData}
                meta={data?.data.meta}
                isLoading={isLoading}
                onPageChange={setPage}
                onPageSizeChange={setSize}
            />

            <StaffForm
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false);
                    setEditStaff(null);
                }}
                staff={editStaff}
            />

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    if (deleteId) {
                        deleteStaff.mutate(deleteId, {
                            onSuccess: () => setDeleteId(null),
                        });
                    }
                }}
                message="Xóa nhân sự này?"
                isLoading={deleteStaff.isPending}
            />

            <StaffImportModal isOpen={showImport} onClose={() => setShowImport(false)} />
        </div>
    );
}

export const Component = StaffListPage;

