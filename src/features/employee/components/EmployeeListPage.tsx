import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useEmployees } from "../hooks/useEmployees";
import { useDeleteEmployee } from "../hooks/useDeleteEmployee";
import { DataTable } from "@/components/common/DataTable";
import { SearchBar } from "@/components/common/SearchBar";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { AccessDenied } from "@/components/common/AccessDenied";
import { Button } from "@/components/ui/Button";
import { EmployeeForm } from "./EmployeeForm";
import { is403Error } from "@/utils/is403Error";
import type { EmployeeResponse } from "../types";
import dayjs from "dayjs";

const columnHelper = createColumnHelper<EmployeeResponse>();

export function EmployeeListPage() {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editEmployee, setEditEmployee] = useState<EmployeeResponse | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { data, isLoading, error } = useEmployees({ page, size });
    const deleteEmployee = useDeleteEmployee();

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
        columnHelper.accessor("phone", {
            header: "Điện thoại",
            cell: (info) => info.getValue() ?? "—",
        }),
        columnHelper.accessor("email", {
            header: "Email",
            cell: (info) => info.getValue() ?? "—",
        }),
        columnHelper.accessor("department", {
            header: "Phòng ban",
            cell: (info) => info.getValue() ?? "—",
        }),
        columnHelper.accessor("salaryCode", {
            header: "Mã BL",
            cell: (info) => info.getValue() ?? "—",
        }),
        columnHelper.accessor("entryDate", {
            header: "Vào làm",
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
                    <button
                        type="button"
                        onClick={() => {
                            setEditEmployee(row.original);
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
              (e) =>
                  e.fullName.toLowerCase().includes(search.toLowerCase()) ||
                  (e.phone ?? "").toLowerCase().includes(search.toLowerCase()) ||
                  (e.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
                  (e.code ?? "").toLowerCase().includes(search.toLowerCase()),
          )
        : rows;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Nhân viên</h1>
                    <p className="text-slate-500 mt-1">Quản lý nhân viên (legacy employee)</p>
                </div>
                <Button
                    onClick={() => {
                        setEditEmployee(null);
                        setShowForm(true);
                    }}
                >
                    <Plus className="w-4 h-4" />
                    Thêm nhân viên
                </Button>
            </div>

            <div className="mb-4">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Tìm theo tên, SĐT, email, mã..."
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

            <EmployeeForm
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false);
                    setEditEmployee(null);
                }}
                employee={editEmployee}
            />

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    if (deleteId) {
                        deleteEmployee.mutate(deleteId, {
                            onSuccess: () => setDeleteId(null),
                        });
                    }
                }}
                message="Xóa nhân viên này? Có thể lỗi nếu dữ liệu legacy khác còn tham chiếu."
                isLoading={deleteEmployee.isPending}
            />
        </div>
    );
}

export const Component = EmployeeListPage;
