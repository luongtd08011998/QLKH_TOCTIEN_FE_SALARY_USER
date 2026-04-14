import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCreateRole } from "../hooks/useCreateRole";
import { useUpdateRole } from "../hooks/useUpdateRole";
import { usePermissions } from "@/features/permission/hooks/usePermissions";
import type { RoleResponse } from "../types";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/utils/error";

const schema = z.object({
    name: z.string().min(1, "Role name is required"),
    description: z.string().optional(),
    permissionIds: z.array(z.number()),
});

type FormData = z.infer<typeof schema>;

interface RoleFormProps {
    isOpen: boolean;
    onClose: () => void;
    role: RoleResponse | null;
}

export function RoleForm({ isOpen, onClose, role }: RoleFormProps) {
    const isEdit = role !== null;
    const create = useCreateRole();
    const update = useUpdateRole();
    const { data: permData } = usePermissions({ page: 1, size: 200 });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const selectedIds = watch("permissionIds") ?? [];

    useEffect(() => {
        if (isOpen) {
            if (role) {
                reset({
                    name: role.name,
                    description: role.description ?? "",
                    permissionIds: role.permissions.map((p) => p.id),
                });
            } else {
                reset({ name: "", description: "", permissionIds: [] });
            }
        }
    }, [isOpen, role, reset]);

    // Group permissions by module
    const groupedPermissions = useMemo(() => {
        const perms = permData?.data.result ?? [];
        const groups: Record<
            string,
            { id: number; name: string; method: string }[]
        > = {};
        for (const p of perms) {
            const mod = p.module || "OTHER";
            if (!groups[mod]) groups[mod] = [];
            groups[mod].push({ id: p.id, name: p.name, method: p.method });
        }
        return groups;
    }, [permData]);

    function togglePermission(id: number) {
        const next = selectedIds.includes(id)
            ? selectedIds.filter((x) => x !== id)
            : [...selectedIds, id];
        setValue("permissionIds", next);
    }

    function toggleModule(module: string) {
        const moduleIds = groupedPermissions[module]?.map((p) => p.id) ?? [];
        const allSelected = moduleIds.every((id) => selectedIds.includes(id));

        if (allSelected) {
            setValue(
                "permissionIds",
                selectedIds.filter((id) => !moduleIds.includes(id)),
            );
        } else {
            const merged = [...new Set([...selectedIds, ...moduleIds])];
            setValue("permissionIds", merged);
        }
    }

    function onSubmit(data: FormData) {
        const payload = {
            name: data.name,
            description: data.description || undefined,
            permissionIds: data.permissionIds,
        };

        if (isEdit && role) {
            update.mutate(
                { id: role.id, ...payload },
                {
                    onSuccess: () => {
                        toast.success("C\u1eadp nh\u1eadt quy\u1ec1n th\u00e0nh c\u00f4ng");
                        onClose();
                    },
                    onError: (error) => {
                        toast.error(getErrorMessage(error, "L\u1ed7i c\u1eadp nh\u1eadt quy\u1ec1n"));
                    }
                }
            );
        } else {
            create.mutate(
                payload,
                {
                    onSuccess: () => {
                        toast.success("Th\u00eam quy\u1ec1n th\u00e0nh c\u00f4ng");
                        onClose();
                    },
                    onError: (error) => {
                        toast.error(getErrorMessage(error, "L\u1ed7i th\u00eam quy\u1ec1n"));
                    }
                }
            );
        }
    }

    const mutation = isEdit ? update : create;
    const errorMessage = mutation.error ? getErrorMessage(mutation.error) : null;

    const methodColor: Record<string, string> = {
        GET: "text-emerald-700 bg-emerald-50",
        POST: "text-blue-700 bg-blue-50",
        PUT: "text-amber-700 bg-amber-50",
        DELETE: "text-red-700 bg-red-50",
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Edit Role" : "Create Role"}
            size="xl"
        >
            {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Role Name"
                        placeholder="ADMIN"
                        error={errors.name?.message}
                        {...register("name")}
                    />
                    <Input
                        label="Description"
                        placeholder="Full system access"
                        error={errors.description?.message}
                        {...register("description")}
                    />
                </div>

                {/* Permissions grouped by module */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-700">
                            Permissions
                        </label>
                        <Badge variant="primary">{selectedIds.length} selected</Badge>
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                        {Object.entries(groupedPermissions).map(([module, perms]) => {
                            const allSelected = perms.every((p) =>
                                selectedIds.includes(p.id),
                            );
                            return (
                                <div
                                    key={module}
                                    className="border border-slate-200 rounded-xl p-4"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={() => toggleModule(module)}
                                            className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-sm font-semibold text-slate-700">
                                            {module}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            ({perms.length})
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-6">
                                        {perms.map((perm) => (
                                            <label
                                                key={perm.id}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-colors ${selectedIds.includes(perm.id)
                                                    ? "border-primary-300 bg-primary-50"
                                                    : "border-slate-100 hover:border-slate-200"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(perm.id)}
                                                    onChange={() => togglePermission(perm.id)}
                                                    className="sr-only"
                                                />
                                                <span
                                                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${methodColor[perm.method] ?? ""
                                                        }`}
                                                >
                                                    {perm.method}
                                                </span>
                                                <span className="text-slate-700">{perm.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                    <Button variant="secondary" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={mutation.isPending}>
                        {isEdit ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
