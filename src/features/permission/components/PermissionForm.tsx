import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useCreatePermission } from "../hooks/useCreatePermission";
import { useUpdatePermission } from "../hooks/useUpdatePermission";
import { HTTP_METHODS, MODULES } from "@/config/constants";
import type { PermissionResponse } from "../types";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/utils/error";

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    apiPath: z.string().min(1, "API path is required"),
    method: z.enum(["GET", "POST", "PUT", "DELETE"]),
    module: z.string().min(1, "Module is required"),
});

type FormData = z.infer<typeof schema>;

interface PermissionFormProps {
    isOpen: boolean;
    onClose: () => void;
    permission: PermissionResponse | null;
}

export function PermissionForm({
    isOpen,
    onClose,
    permission,
}: PermissionFormProps) {
    const isEdit = permission !== null;
    const create = useCreatePermission();
    const update = useUpdatePermission();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    useEffect(() => {
        if (isOpen) {
            if (permission) {
                reset({
                    name: permission.name,
                    apiPath: permission.apiPath,
                    method: permission.method,
                    module: permission.module,
                });
            } else {
                reset({ name: "", apiPath: "", method: "GET", module: "" });
            }
        }
    }, [isOpen, permission, reset]);

    function onSubmit(data: FormData) {
        if (isEdit && permission) {
            update.mutate(
                { id: permission.id, ...data },
                {
                    onSuccess: () => {
                        toast.success("C\u1eadp nh\u1eadt api th\u00e0nh c\u00f4ng");
                        onClose();
                    },
                    onError: (error) => {
                        toast.error(getErrorMessage(error, "L\u1ed7i c\u1eadp nh\u1eadt api"));
                    }
                }
            );
        } else {
            create.mutate(
                data,
                {
                    onSuccess: () => {
                        toast.success("Th\u00eam api th\u00e0nh c\u00f4ng");
                        onClose();
                    },
                    onError: (error) => {
                        toast.error(getErrorMessage(error, "L\u1ed7i th\u00eam api"));
                    }
                }
            );
        }
    }

    const mutation = isEdit ? update : create;
    const errorMessage = mutation.error ? getErrorMessage(mutation.error) : null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Edit Permission" : "Create Permission"}
        >
            {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Permission Name"
                    placeholder="CREATE_USER"
                    error={errors.name?.message}
                    {...register("name")}
                />
                <Input
                    label="API Path"
                    placeholder="/api/v1/users"
                    error={errors.apiPath?.message}
                    {...register("apiPath")}
                />
                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Method"
                        options={HTTP_METHODS.map((m) => ({ label: m, value: m }))}
                        error={errors.method?.message}
                        {...register("method")}
                    />
                    <Select
                        label="Module"
                        options={MODULES.map((m) => ({ label: m, value: m }))}
                        placeholder="Select module"
                        error={errors.module?.message}
                        {...register("module")}
                    />
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
