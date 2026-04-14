import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { usePermissions } from "../hooks/usePermissions";
import { useDeletePermission } from "../hooks/useDeletePermission";
import { DataTable } from "@/components/common/DataTable";
import { SearchBar } from "@/components/common/SearchBar";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { AccessDenied } from "@/components/common/AccessDenied";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PermissionForm } from "./PermissionForm";
import { is403Error } from "@/utils/is403Error";
import type { PermissionResponse } from "../types";

const columnHelper = createColumnHelper<PermissionResponse>();

const methodVariant: Record<string, "success" | "primary" | "warning" | "danger"> = {
    GET: "success",
    POST: "primary",
    PUT: "warning",
    DELETE: "danger",
};

export function PermissionListPage() {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editPerm, setEditPerm] = useState<PermissionResponse | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { data, isLoading, error } = usePermissions({ page, size });
    const deletePerm = useDeletePermission();

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
        columnHelper.accessor("apiPath", {
            header: "API Path",
            cell: (info) => (
                <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">
                    {info.getValue()}
                </code>
            ),
        }),
        columnHelper.accessor("method", {
            header: "Method",
            cell: (info) => (
                <Badge variant={methodVariant[info.getValue()] ?? "default"}>
                    {info.getValue()}
                </Badge>
            ),
        }),
        columnHelper.accessor("module", {
            header: "Module",
            cell: (info) => (
                <Badge variant="default">{info.getValue()}</Badge>
            ),
        }),
        columnHelper.display({
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <div className="flex items-center gap-1 justify-end">
                    <button
                        onClick={() => { setEditPerm(row.original); setShowForm(true); }}
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
        ? (data?.data.result ?? []).filter(
            (p) =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.apiPath.toLowerCase().includes(search.toLowerCase()),
        )
        : (data?.data.result ?? []);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Permissions</h1>
                    <p className="text-slate-500 mt-1">Manage API permissions</p>
                </div>
                <Button onClick={() => { setEditPerm(null); setShowForm(true); }}>
                    <Plus className="w-4 h-4" />
                    Add Permission
                </Button>
            </div>

            <div className="mb-4">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search by name or API path..."
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

            <PermissionForm
                isOpen={showForm}
                onClose={() => { setShowForm(false); setEditPerm(null); }}
                permission={editPerm}
            />

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    if (deleteId) {
                        deletePerm.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
                    }
                }}
                message="Are you sure you want to delete this permission? It will be removed from all roles."
                isLoading={deletePerm.isPending}
            />
        </div>
    );
}

export const Component = PermissionListPage;
