import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useCreateEmployee } from "../hooks/useCreateEmployee";
import { useUpdateEmployee } from "../hooks/useUpdateEmployee";
import type {
    CreateEmployeeRequest,
    EmployeeResponse,
} from "../types";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/utils/error";

const schema = z.object({
    fullName: z.string().min(1, "Họ tên không được để trống"),
    firstName: z.string().optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    description: z.string().optional(),
    department: z.string().optional(),
    salaryCode: z.string().optional(),
    salaryCategory: z.string().optional(),
    salaryRank: z.string().optional(),
    code: z.string().optional(),
    reserve1: z.string().optional(),
    reserve2: z.string().optional(),
    entryDate: z.string().optional(),
    exitDate: z.string().optional(),
    birthday: z.string().optional(),
    isActive: z.string().optional(),
    sex: z.string().optional(),
    modifiedById: z.string().optional(),
    workType: z.string().optional(),
    userId: z.string().optional(),
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

function optActive(
    s: string | undefined,
): CreateEmployeeRequest["isActive"] {
    const t = strip(s);
    if (!t) return undefined;
    if (t === "HOAT_DONG" || t === "KHONG_HOAT_DONG") return t;
    return undefined;
}

function optSex(s: string | undefined): CreateEmployeeRequest["sex"] {
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

interface EmployeeFormProps {
    isOpen: boolean;
    onClose: () => void;
    employee: EmployeeResponse | null;
}

function toDatetimeLocal(iso: string | null | undefined): string {
    if (!iso) return "";
    return iso.length >= 16 ? iso.slice(0, 16) : iso;
}

export function EmployeeForm({ isOpen, onClose, employee }: EmployeeFormProps) {
    const isEdit = employee !== null;
    const create = useCreateEmployee();
    const update = useUpdateEmployee();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    useEffect(() => {
        if (!isOpen) return;
        if (employee) {
            reset({
                fullName: employee.fullName,
                firstName: employee.firstName ?? "",
                middleName: employee.middleName ?? "",
                lastName: employee.lastName ?? "",
                phone: employee.phone ?? "",
                email: employee.email ?? "",
                address: employee.address ?? "",
                description: employee.description ?? "",
                department: employee.department ?? "",
                salaryCode: employee.salaryCode ?? "",
                salaryCategory: employee.salaryCategory ?? "",
                salaryRank: employee.salaryRank ?? "",
                code: employee.code ?? "",
                reserve1: employee.reserve1 ?? "",
                reserve2: employee.reserve2 ?? "",
                entryDate: toDatetimeLocal(employee.entryDate),
                exitDate: toDatetimeLocal(employee.exitDate),
                birthday: toDatetimeLocal(employee.birthday),
                isActive:
                    employee.isActive === null || employee.isActive === undefined
                        ? ""
                        : String(employee.isActive),
                sex:
                    employee.sex === null || employee.sex === undefined
                        ? ""
                        : String(employee.sex),
                modifiedById:
                    employee.modifiedById == null ? "" : String(employee.modifiedById),
                workType:
                    employee.workType == null ? "" : String(employee.workType),
                userId: employee.userId == null ? "" : String(employee.userId),
            });
        } else {
            reset({
                fullName: "",
                firstName: "",
                middleName: "",
                lastName: "",
                phone: "",
                email: "",
                address: "",
                description: "",
                department: "",
                salaryCode: "",
                salaryCategory: "",
                salaryRank: "",
                code: "",
                reserve1: "",
                reserve2: "",
                entryDate: "",
                exitDate: "",
                birthday: "",
                isActive: "",
                sex: "",
                modifiedById: "",
                workType: "",
                userId: "",
            });
        }
    }, [isOpen, employee, reset]);

    function onSubmit(data: FormData) {
        const base = {
            fullName: data.fullName.trim(),
            firstName: strip(data.firstName),
            middleName: strip(data.middleName),
            lastName: strip(data.lastName),
            entryDate: toIsoDateTime(data.entryDate),
            exitDate: toIsoDateTime(data.exitDate),
            description: strip(data.description),
            phone: strip(data.phone),
            address: strip(data.address),
            email: strip(data.email),
            isActive: optActive(data.isActive),
            birthday: toIsoDateTime(data.birthday),
            sex: optSex(data.sex),
            department: strip(data.department),
            modifiedById: optInt(data.modifiedById),
            workType: optInt(data.workType),
            salaryCode: strip(data.salaryCode),
            salaryCategory: strip(data.salaryCategory),
            salaryRank: strip(data.salaryRank),
            reserve1: strip(data.reserve1),
            reserve2: strip(data.reserve2),
            code: strip(data.code),
            userId: optInt(data.userId),
        };

        if (isEdit && employee) {
            update.mutate(
                { id: employee.id, ...base },
                {
                    onSuccess: () => {
                        toast.success("Cập nhật nhân viên thành công");
                        onClose();
                    },
                    onError: (error) => {
                        toast.error(getErrorMessage(error, "Lỗi cập nhật nhân viên"));
                    },
                },
            );
        } else {
            create.mutate(base, {
                onSuccess: () => {
                    toast.success("Thêm nhân viên thành công");
                    onClose();
                },
                onError: (error) => {
                    toast.error(getErrorMessage(error, "Lỗi thêm nhân viên"));
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
            title={isEdit ? "Sửa nhân viên" : "Thêm nhân viên"}
            size="xl"
        >
            {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3">
                        Thông tin cơ bản
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Họ và tên *"
                            error={errors.fullName?.message}
                            {...register("fullName")}
                        />
                        <Input label="Họ" {...register("lastName")} />
                        <Input label="Đệm" {...register("middleName")} />
                        <Input label="Tên" {...register("firstName")} />
                        <Input label="Điện thoại" {...register("phone")} />
                        <Input label="Email" type="email" {...register("email")} />
                        <Input label="Phòng ban" {...register("department")} />
                        <Input label="Địa chỉ" {...register("address")} />
                    </div>
                    <div className="mt-4">
                        <Input label="Mô tả" {...register("description")} />
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3">
                        Lương / mã
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label="Mã bảng lương" {...register("salaryCode")} />
                        <Input label="Ngạch" {...register("salaryCategory")} />
                        <Input label="Bậc" {...register("salaryRank")} />
                        <Input label="Mã nhân viên (code)" {...register("code")} />
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3">
                        Thời gian &amp; hệ thống
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Ngày vào"
                            type="datetime-local"
                            {...register("entryDate")}
                        />
                        <Input
                            label="Ngày ra"
                            type="datetime-local"
                            {...register("exitDate")}
                        />
                        <Input
                            label="Sinh nhật"
                            type="datetime-local"
                            {...register("birthday")}
                        />
                        <Select
                            label="Trạng thái làm việc"
                            options={[
                                { label: "— Chưa chọn —", value: "" },
                                { label: "Hoạt động", value: "HOAT_DONG" },
                                {
                                    label: "Không hoạt động",
                                    value: "KHONG_HOAT_DONG",
                                },
                            ]}
                            {...register("isActive")}
                        />
                        <Select
                            label="Giới tính"
                            options={[
                                { label: "— Chưa chọn —", value: "" },
                                { label: "Nam", value: "NAM" },
                                { label: "Nữ", value: "NU" },
                            ]}
                            {...register("sex")}
                        />
                        <Input label="Loại công việc (workType)" {...register("workType")} />
                        <Input label="Người sửa (modifiedById)" {...register("modifiedById")} />
                        <Input label="User ID liên kết" {...register("userId")} />
                        <Input label="Reserve 1" {...register("reserve1")} />
                        <Input label="Reserve 2" {...register("reserve2")} />
                    </div>
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
