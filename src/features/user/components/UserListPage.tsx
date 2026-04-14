import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useUsers } from "../hooks/useUsers";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { DataTable } from "@/components/common/DataTable";
import { SearchBar } from "@/components/common/SearchBar";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { AccessDenied } from "@/components/common/AccessDenied";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { UserForm } from "./UserForm";
import { is403Error } from "@/utils/is403Error";
import type { UserResponse } from "../types";
import dayjs from "dayjs";

const columnHelper = createColumnHelper<UserResponse>();

export function UserListPage() {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editUser, setEditUser] = useState<UserResponse | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { data, isLoading, error } = useUsers({ page, size });
    const deleteUser = useDeleteUser();

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
        columnHelper.accessor("email", {
            header: "Email",
        }),
        columnHelper.accessor("company", {
            header: "Company",
            cell: (info) => info.getValue()?.name ?? "—",
        }),
        columnHelper.accessor("roles", {
            header: "Roles",
            cell: (info) => (
                <div className="flex flex-wrap gap-1">
                    {info.getValue().map((role) => (
                        <Badge key={role.id} variant="primary">
                            {role.name}
                        </Badge>
                    ))}
                </div>
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
                        onClick={() => {
                            setEditUser(row.original);
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
        ? (data?.data.result ?? []).filter(
            (u) =>
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase()),
        )
        : (data?.data.result ?? []);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Users</h1>
                    <p className="text-slate-500 mt-1">Manage system users</p>
                </div>
                <Button onClick={() => { setEditUser(null); setShowForm(true); }}>
                    <Plus className="w-4 h-4" />
                    Add User
                </Button>
            </div>

            <div className="mb-4">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search by name or email..."
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

            {/* Create / Edit Form */}
            <UserForm
                isOpen={showForm}
                onClose={() => { setShowForm(false); setEditUser(null); }}
                user={editUser}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    if (deleteId) {
                        deleteUser.mutate(deleteId, {
                            onSuccess: () => setDeleteId(null),
                        });
                    }
                }}
                message="Are you sure you want to delete this user? This action cannot be undone."
                isLoading={deleteUser.isPending}
            />
        </div>
    );
}

export const Component = UserListPage;
