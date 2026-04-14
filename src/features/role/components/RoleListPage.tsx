import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useRoles } from "../hooks/useRoles";
import { useDeleteRole } from "../hooks/useDeleteRole";
import { DataTable } from "@/components/common/DataTable";
import { SearchBar } from "@/components/common/SearchBar";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { AccessDenied } from "@/components/common/AccessDenied";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RoleForm } from "./RoleForm";
import { is403Error } from "@/utils/is403Error";
import type { RoleResponse } from "../types";
import dayjs from "dayjs";

const columnHelper = createColumnHelper<RoleResponse>();

export function RoleListPage() {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editRole, setEditRole] = useState<RoleResponse | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { data, isLoading, error } = useRoles({ page, size });
    const deleteRole = useDeleteRole();

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
                <span className="text-slate-500">{info.getValue() ?? "—"}</span>
            ),
        }),
        columnHelper.accessor("permissions", {
            header: "Permissions",
            cell: (info) => (
                <Badge variant="primary">{info.getValue().length} permissions</Badge>
            ),
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
                        onClick={() => { setEditRole(row.original); setShowForm(true); }}
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
        ? (data?.data.result ?? []).filter((r) =>
            r.name.toLowerCase().includes(search.toLowerCase()),
        )
        : (data?.data.result ?? []);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Roles</h1>
                    <p className="text-slate-500 mt-1">Manage roles and permissions</p>
                </div>
                <Button onClick={() => { setEditRole(null); setShowForm(true); }}>
                    <Plus className="w-4 h-4" />
                    Add Role
                </Button>
            </div>

            <div className="mb-4">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search roles..."
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

            <RoleForm
                isOpen={showForm}
                onClose={() => { setShowForm(false); setEditRole(null); }}
                role={editRole}
            />

            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    if (deleteId) {
                        deleteRole.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
                    }
                }}
                message="Are you sure you want to delete this role? It will be removed from all users."
                isLoading={deleteRole.isPending}
            />
        </div>
    );
}

export const Component = RoleListPage;
