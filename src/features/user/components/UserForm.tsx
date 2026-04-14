import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { useCreateUser } from "../hooks/useCreateUser";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useCompanies } from "@/features/company/hooks/useCompanies";
import { useRoles } from "@/features/role/hooks/useRoles";
import { GENDER_OPTIONS } from "@/config/constants";
import type { UserResponse } from "../types";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/utils/error";

const userFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().optional(),
    password: z.string().optional(),
    age: z.string().optional(),
    gender: z.string().optional(),
    address: z.string().optional(),
    avatar: z.string().optional(),
    companyId: z.string().optional(),
    roleIds: z.array(z.number()).optional(),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserResponse | null;
}

export function UserForm({ isOpen, onClose, user }: UserFormProps) {
    const isEdit = user !== null;
    const createUser = useCreateUser();
    const updateUser = useUpdateUser();
    const { data: companiesData } = useCompanies({ page: 1, size: 100 });
    const { data: rolesData } = useRoles({ page: 1, size: 100 });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
    });

    const selectedRoleIds = watch("roleIds") ?? [];
    const avatarValue = watch("avatar");

    useEffect(() => {
        if (isOpen) {
            if (user) {
                reset({
                    name: user.name,
                    age: user.age?.toString() ?? "",
                    gender: user.gender ?? "",
                    address: user.address ?? "",
                    avatar: user.avatar ?? "",
                    companyId: user.company?.id?.toString() ?? "",
                    roleIds: user.roles.map((r) => r.id),
                });
            } else {
                reset({
                    name: "",
                    email: "",
                    password: "",
                    age: "",
                    gender: "",
                    address: "",
                    avatar: "",
                    companyId: "",
                    roleIds: [],
                });
            }
        }
    }, [isOpen, user, reset]);

    function onSubmit(data: UserFormData) {
        const cleanAge = data.age ? Number(data.age) : undefined;
        const cleanGender =
            data.gender
                ? (data.gender as "MALE" | "FEMALE" | "OTHER")
                : undefined;
        const cleanCompanyId =
            data.companyId
                ? Number(data.companyId)
                : undefined;

        if (isEdit && user) {
            updateUser.mutate(
                {
                    id: user.id,
                    name: data.name,
                    age: cleanAge,
                    gender: cleanGender,
                    address: data.address || undefined,
                    avatar: data.avatar || undefined,
                    companyId: cleanCompanyId,
                    roleIds: data.roleIds,
                },
                {
                    onSuccess: () => {
                        toast.success("C\u1eadp nh\u1eadt ng\u01b0\u1eddi d\u00f9ng th\u00e0nh c\u00f4ng");
                        onClose();
                    },
                    onError: (error) => {
                        toast.error(getErrorMessage(error, "L\u1ed7i c\u1eadp nh\u1eadt ng\u01b0\u1eddi d\u00f9ng"));
                    }
                },
            );
        } else {
            const createData = data;
            createUser.mutate(
                {
                    name: createData.name,
                    email: createData.email ?? "",
                    password: createData.password ?? "",
                    age: cleanAge,
                    gender: cleanGender,
                    address: createData.address || undefined,
                    avatar: createData.avatar || undefined,
                    companyId: cleanCompanyId,
                    roleIds: createData.roleIds,
                },
                {
                    onSuccess: () => {
                        toast.success("Th\u00eam ng\u01b0\u1eddi d\u00f9ng th\u00e0nh c\u00f4ng");
                        onClose();
                    },
                    onError: (error) => {
                        toast.error(getErrorMessage(error, "L\u1ed7i th\u00eam ng\u01b0\u1eddi d\u00f9ng"));
                    }
                },
            );
        }
    }

    const mutation = isEdit ? updateUser : createUser;
    const errorMessage = mutation.error ? getErrorMessage(mutation.error) : null;

    const companies = companiesData?.data.result ?? [];
    const roles = rolesData?.data.result ?? [];

    function toggleRole(roleId: number) {
        const current = selectedRoleIds;
        const next = current.includes(roleId)
            ? current.filter((id) => id !== roleId)
            : [...current, roleId];
        setValue("roleIds", next);
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Edit User" : "Create User"}
            size="lg"
        >
            {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Full Name"
                    error={errors.name?.message}
                    {...register("name")}
                />

                {!isEdit && (
                    <>
                        <Input
                            label="Email"
                            type="email"
                            error={errors.email?.message}
                            {...register("email")}
                        />
                        <Input
                            label="Password"
                            type="password"
                            error={errors.password?.message}
                            {...register("password")}
                        />
                    </>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Age"
                        type="number"
                        error={errors.age?.message}
                        {...register("age")}
                    />
                    <Select
                        label="Gender"
                        options={[...GENDER_OPTIONS]}
                        placeholder="Select gender"
                        error={errors.gender?.message}
                        {...register("gender")}
                    />
                </div>

                <Input
                    label="Address"
                    error={errors.address?.message}
                    {...register("address")}
                />

                <FileUpload
                    label="Avatar"
                    folder="avatars"
                    value={avatarValue}
                    onChange={(fileName) => setValue("avatar", fileName)}
                />

                <Select
                    label="Company"
                    options={companies.map((c) => ({ label: c.name, value: c.id }))}
                    placeholder="Select company"
                    error={errors.companyId?.message}
                    {...register("companyId")}
                />

                {/* Roles — checkbox list */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Roles</label>
                    <div className="flex flex-wrap gap-2">
                        {roles.map((role) => (
                            <label
                                key={role.id}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-colors ${selectedRoleIds.includes(role.id)
                                    ? "border-primary-500 bg-primary-50 text-primary-700"
                                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedRoleIds.includes(role.id)}
                                    onChange={() => toggleRole(role.id)}
                                    className="sr-only"
                                />
                                {role.name}
                            </label>
                        ))}
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
