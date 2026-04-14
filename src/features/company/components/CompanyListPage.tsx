import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useCompanies } from "../hooks/useCompanies";
import { useDeleteCompany } from "../hooks/useDeleteCompany";
import { DataTable } from "@/components/common/DataTable";
import { SearchBar } from "@/components/common/SearchBar";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { AccessDenied } from "@/components/common/AccessDenied";
import { Button } from "@/components/ui/Button";
import { CompanyForm } from "./CompanyForm";
import { is403Error } from "@/utils/is403Error";
import type { CompanyResponse } from "../types";
import dayjs from "dayjs";

const columnHelper = createColumnHelper<CompanyResponse>();

export function CompanyListPage() {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editCompany, setEditCompany] = useState<CompanyResponse | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { data, isLoading, error } = useCompanies({ page, size });
    const deleteCompany = useDeleteCompany();

    if (is403Error(error)) {
        return <AccessDenied />;
    }

    const columns = [
        columnHelper.accessor("name", {
            header: "Name",
            cell: (info) => (
                <span className="font-medium text-slate-900">{info.getValue()}</span>
            ),
        }),
        columnHelper.accessor("description", {
            header: "Description",
            cell: (info) => (
                <span className="text-slate-500 line-clamp-2">
                    {info.getValue() ?? "—"}
                </span>
            ),
        }),
        columnHelper.accessor("address", {
            header: "Address",
            cell: (info) => info.getValue() ?? "—",
        }),
        columnHelper.accessor("createdAt", {
            header: "Created",
            cell: (info) => dayjs(info.getValue()).format("DD/MM/YYYY"),
        }),
        columnHelper.display({
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <div className="flex items-center gap-1 justify-end">
                    <button
                        onClick={() => {
                            setEditCompany(row.original);
                            setShowForm(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setDeleteId(row.original.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        }),
    ];

    const filteredData = search
        ? (data?.data.result ?? []).filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase()),
        )
        : (data?.data.result ?? []);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Companies</h1>
                    <p className="text-slate-500 mt-1">Manage companies</p>
                </div>
                <Button onClick={() => { setEditCompany(null); setShowForm(true); }}>
                    <Plus className="w-4 h-4" />
                    Add Company
                </Button>
            </div>

            <div className="mb-4">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search companies..."
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

            <CompanyForm
                isOpen={showForm}
                onClose={() => { setShowForm(false); setEditCompany(null); }}
                company={editCompany}
            />

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    if (deleteId) {
                        deleteCompany.mutate(deleteId, {
                            onSuccess: () => setDeleteId(null),
                        });
                    }
                }}
                message="Are you sure you want to delete this company? Users assigned to this company will be unassigned."
                isLoading={deleteCompany.isPending}
            />
        </div>
    );
}

export const Component = CompanyListPage;
