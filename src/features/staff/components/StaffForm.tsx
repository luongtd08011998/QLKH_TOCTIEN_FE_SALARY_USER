import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useCreateStaff } from "../hooks/useCreateStaff";
import { useUpdateStaff } from "../hooks/useUpdateStaff";
import type { CreateStaffRequest, StaffResponse } from "../types";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/utils/error";

const schema = z.object({
    fullName: z.string().min(1, "Họ tên không được để trống"),
    firstName: z.string().optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
    birthday: z.string().optional(),
    sex: z.string().optional(),
    email: z.string().optional(),
    userId: z.string().optional(),
    isActive: z.string().optional(),
    description: z.string().optional(),
    preferences: z.string().optional(),
    userType: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function strip(s: string | undefined): string | undefined {
    const t = s?.trim();
    return t ? t : undefined;
}

function optInt(s: string | undefined): number | undefined {
    const t = s?.trim();
    if (!t) return undefined;
    const n = Number(t);
    return Number.isFinite(n) ? Math.trunc(n) : undefined;
}

function optActive(s: string | undefined): CreateStaffRequest["isActive"] {
    const t = strip(s);
    if (!t) return undefined;
    if (t === "HOAT_DONG" || t === "KHONG_HOAT_DONG") return t;
    return undefined;
}

function optSex(s: string | undefined): CreateStaffRequest["sex"] {
    const t = strip(s);
    if (!t) return undefined;
    if (t === "NAM" || t === "NU") return t;
    return undefined;
}

function toIsoDateTime(s: string | undefined): string | undefined {
    const t = strip(s);
    if (!t) return undefined;
    if (t.length === 16 && t.includes("T")) return `${t}:00`;
    return t;
}

function toDatetimeLocal(iso: string | null | undefined): string {
    if (!iso) return "";
    return iso.length >= 16 ? iso.slice(0, 16) : iso;
}

interface StaffFormProps {
    isOpen: boolean;
    onClose: () => void;
    staff: StaffResponse | null;
}

export function StaffForm({ isOpen, onClose, staff }: StaffFormProps) {
    const isEdit = staff !== null;
    const create = useCreateStaff();
    const update = useUpdateStaff();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    useEffect(() => {
        if (!isOpen) return;
        if (staff) {
            reset({
                fullName: staff.fullName,
                firstName: staff.firstName ?? "",
                middleName: staff.middleName ?? "",
                lastName: staff.lastName ?? "",
                birthday: toDatetimeLocal(staff.birthday),
                sex: staff.sex ?? "",
                email: staff.email ?? "",
                userId: staff.userId == null ? "" : String(staff.userId),
                isActive: staff.isActive ?? "",
                description: staff.description ?? "",
                preferences: staff.preferences ?? "",
                userType: staff.userType == null ? "" : String(staff.userType),
            });
        } else {
            reset({
                fullName: "",
                firstName: "",
                middleName: "",
                lastName: "",
                birthday: "",
                sex: "",
                email: "",
                userId: "",
                isActive: "",
                description: "",
                preferences: "",
                userType: "",
            });
        }
    }, [isOpen, staff, reset]);

    function onSubmit(data: FormData) {
        const base = {
            fullName: data.fullName.trim(),
            firstName: strip(data.firstName),
            middleName: strip(data.middleName),
            lastName: strip(data.lastName),
            birthday: toIsoDateTime(data.birthday),
            sex: optSex(data.sex),
            email: strip(data.email),
            userId: optInt(data.userId),
            isActive: optActive(data.isActive),
            description: strip(data.description),
            preferences: strip(data.preferences),
            userType: optInt(data.userType),
        };

        if (isEdit && staff) {
            update.mutate(
                { id: staff.id, ...base },
                {
                    onSuccess: () => {
                        toast.success("Cập nhật nhân sự thành công");
                        onClose();
                    },
                    onError: (error) => {
                        toast.error(getErrorMessage(error, "Lỗi cập nhật nhân sự"));
                    },
                },
            );
        } else {
            create.mutate(base, {
                onSuccess: () => {
                    toast.success("Thêm nhân sự thành công");
                    onClose();
                },
                onError: (error) => {
                    toast.error(getErrorMessage(error, "Lỗi thêm nhân sự"));
                },
            });
        }
    }

    const mutation = isEdit ? update : create;
    const errorMessage = mutation.error ? getErrorMessage(mutation.error) : null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "Sửa nhân sự" : "Thêm nhân sự"}
            size="xl"
        >
            {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label="Họ và tên *"
                        error={errors.fullName?.message}
                        {...register("fullName")}
                    />
                    <Input label="Họ" {...register("lastName")} />
                    <Input label="Đệm" {...register("middleName")} />
                    <Input label="Tên" {...register("firstName")} />
                    <Input label="Email" type="email" {...register("email")} />
                    <Input label="User ID (users.id)" {...register("userId")} />
                    <Input
                        label="Ngày sinh"
                        type="datetime-local"
                        {...register("birthday")}
                    />
                    <Select label="Giới tính" {...register("sex")}>
                        <option value="">—</option>
                        <option value="NAM">Nam</option>
                        <option value="NU">Nữ</option>
                    </Select>
                    <Select label="Trạng thái" {...register("isActive")}>
                        <option value="">—</option>
                        <option value="HOAT_DONG">Hoạt động</option>
                        <option value="KHONG_HOAT_DONG">Không hoạt động</option>
                    </Select>
                    <Input label="User Type" {...register("userType")} />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <Input label="Mô tả" {...register("description")} />
                    <Input label="Preferences (JSON/Text)" {...register("preferences")} />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                    <Button variant="secondary" type="button" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button type="submit" isLoading={mutation.isPending}>
                        {isEdit ? "Cập nhật" : "Tạo mới"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

