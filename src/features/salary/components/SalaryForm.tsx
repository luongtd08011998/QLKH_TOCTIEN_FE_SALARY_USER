import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCreateSalary } from "../hooks/useCreateSalary";
import { useUpdateSalary } from "../hooks/useUpdateSalary";
import type { CreateSalaryRequest, SalaryResponse } from "../types";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/utils/error";
import { calcNgayCongFromYearMonth } from "../utils/workingDays";

const optionalStr = z.string().optional();

const schema = z.object({
  yearMonth: z
    .string()
    .min(6, "Kỳ lương phải đúng 6 ký tự")
    .max(6, "Kỳ lương phải đúng 6 ký tự")
    .regex(/^\d{6}$/, "Kỳ lương chỉ gồm 6 chữ số YYYYMM"),
  employeeId: optionalStr,
  income: optionalStr,
  coefficient: optionalStr,
  responsibility: optionalStr,
  seniority: optionalStr,
  toxic: optionalStr,
  other: optionalStr,
  workingDay: optionalStr,
  overtime: optionalStr,
  shift: optionalStr,
  meal: optionalStr,
  phoneOther: optionalStr,
  rewardSupport: optionalStr,
  deductions: optionalStr,
  advance: optionalStr,
  collection: optionalStr,
  insurance: optionalStr,
  tax: optionalStr,
  unionFee: optionalStr,
  company: optionalStr,
  fatherCompany: optionalStr,
  netAmount: optionalStr,
  smsDate: optionalStr,
  reserve1: optionalStr,
  reserve2: optionalStr,
  reserve3: optionalStr,
  reserve4: optionalStr,
  modifiedById: optionalStr,
});

type FormData = z.infer<typeof schema>;

function strip(s: string | undefined): string | undefined {
  const t = s?.trim();
  return t ? t : undefined;
}

function optDouble(s: string | undefined): number | undefined {
  const t = s?.trim();
  if (!t) return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
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

function emptyForm(): FormData {
  return {
    yearMonth: "",
    employeeId: "",
    income: "",
    coefficient: "",
    responsibility: "",
    seniority: "",
    toxic: "",
    other: "",
    workingDay: "",
    overtime: "",
    shift: "",
    meal: "",
    phoneOther: "",
    rewardSupport: "",
    deductions: "",
    advance: "",
    collection: "",
    insurance: "",
    tax: "",
    unionFee: "",
    company: "",
    fatherCompany: "",
    netAmount: "",
    smsDate: "",
    reserve1: "",
    reserve2: "",
    reserve3: "",
    reserve4: "",
    modifiedById: "",
  };
}

function fromSalary(s: SalaryResponse): FormData {
  return {
    yearMonth: s.yearMonth ?? "",
    employeeId: s.employeeId ?? "",
    income: s.income ?? "",
    coefficient: s.coefficient ?? "",
    responsibility: s.responsibility ?? "",
    seniority: s.seniority ?? "",
    toxic: s.toxic ?? "",
    other: s.other ?? "",
    workingDay:
      s.workingDay === null || s.workingDay === undefined
        ? ""
        : String(s.workingDay),
    overtime: s.overtime ?? "",
    shift: s.shift ?? "",
    meal: s.meal ?? "",
    phoneOther: s.phoneOther ?? "",
    rewardSupport: s.rewardSupport ?? "",
    deductions: s.deductions ?? "",
    advance: s.advance ?? "",
    collection: s.collection ?? "",
    insurance: s.insurance ?? "",
    tax: s.tax ?? "",
    unionFee: s.unionFee ?? "",
    company: s.company ?? "",
    fatherCompany: s.fatherCompany ?? "",
    netAmount: s.netAmount ?? "",
    smsDate: toDatetimeLocal(s.smsDate),
    reserve1: s.reserve1 ?? "",
    reserve2: s.reserve2 ?? "",
    reserve3: s.reserve3 ?? "",
    reserve4: s.reserve4 ?? "",
    modifiedById: s.modifiedById ?? "",
  };
}

function toPayload(data: FormData): CreateSalaryRequest {
  return {
    yearMonth: data.yearMonth.trim(),
    employeeId: strip(data.employeeId),
    income: strip(data.income),
    coefficient: strip(data.coefficient),
    responsibility: strip(data.responsibility),
    seniority: strip(data.seniority),
    toxic: strip(data.toxic),
    other: strip(data.other),
    workingDay: optDouble(data.workingDay),
    overtime: strip(data.overtime),
    shift: strip(data.shift),
    meal: strip(data.meal),
    phoneOther: strip(data.phoneOther),
    rewardSupport: strip(data.rewardSupport),
    deductions: strip(data.deductions),
    advance: strip(data.advance),
    collection: strip(data.collection),
    insurance: strip(data.insurance),
    tax: strip(data.tax),
    unionFee: strip(data.unionFee),
    company: strip(data.company),
    fatherCompany: strip(data.fatherCompany),
    netAmount: strip(data.netAmount),
    smsDate: toIsoDateTime(data.smsDate),
    reserve1: strip(data.reserve1),
    reserve2: strip(data.reserve2),
    reserve3: strip(data.reserve3),
    reserve4: strip(data.reserve4),
    modifiedById: strip(data.modifiedById),
  };
}

interface SalaryFormProps {
  isOpen: boolean;
  onClose: () => void;
  salary: SalaryResponse | null;
}

export function SalaryForm({ isOpen, onClose, salary }: SalaryFormProps) {
  const isEdit = salary !== null;
  const create = useCreateSalary();
  const update = useUpdateSalary();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const yearMonth = watch("yearMonth");
  const soCongText = watch("workingDay");
  const ngayCong = useMemo(
    () => calcNgayCongFromYearMonth(yearMonth ?? ""),
    [yearMonth],
  );

  const ngayCongDisplay = useMemo(() => {
    const nc = ngayCong == null ? "" : String(ngayCong);
    const sc = soCongText?.trim();
    if (!nc) return "";
    if (!sc) return nc;
    return `${nc} (Số công: ${sc})`;
  }, [ngayCong, soCongText]);

  useEffect(() => {
    if (!isOpen) return;
    reset(salary ? fromSalary(salary) : emptyForm());
  }, [isOpen, salary, reset]);

  function onSubmit(data: FormData) {
    const base = toPayload(data);
    const soCong = base.workingDay;

    // Validate "số công" (from Excel) against calculated "ngày công".
    if (soCong != null && ngayCong != null) {
      if (soCong > ngayCong) {
        toast.error(
          `Số công (${soCong}) không được lớn hơn ngày công (${ngayCong}). Vui lòng kiểm tra lại Excel.`,
        );
        return;
      }
    }

    if (isEdit && salary) {
      update.mutate(
        { id: salary.id, ...base },
        {
          onSuccess: () => {
            toast.success("Cập nhật bảng lương thành công");
            onClose();
          },
          onError: (error) => {
            toast.error(getErrorMessage(error, "Lỗi cập nhật bảng lương"));
          },
        },
      );
    } else {
      create.mutate(base, {
        onSuccess: () => {
          toast.success("Thêm bảng lương thành công");
          onClose();
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, "Lỗi thêm bảng lương"));
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
      title={isEdit ? "Sửa bảng lương" : "Thêm bảng lương"}
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
            Kỳ &amp; nhân viên
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Kỳ lương (YYYYMM) *"
              maxLength={6}
              inputMode="numeric"
              error={errors.yearMonth?.message}
              {...register("yearMonth")}
            />
            <Input label="Mã nhân viên (legacy)" {...register("employeeId")} />
            <Input
              label='Ngày công (tự tính = số ngày trong tháng - CN)'
              value={ngayCongDisplay}
              readOnly
              tabIndex={-1}
              className="bg-slate-50"
            />
            <Input
              label="Số công (nhập từ Excel)"
              placeholder="Nhập số công từ Excel để kiểm tra"
              {...register("workingDay")}
            />
            <Input
              label="Ngày SMS"
              type="datetime-local"
              {...register("smsDate")}
            />
            <Input
              label="Người sửa (ModifiedById)"
              {...register("modifiedById")}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-3">
            Thu nhập &amp; phụ cấp
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Các khoản thu nhập" {...register("income")} />
            <Input label="Lương hệ số " {...register("coefficient")} />
            <Input label="Trách nhiệm" {...register("responsibility")} />
            <Input label="Thâm niên" {...register("seniority")} />
            <Input label="Phụ cấp độc hại" {...register("toxic")} />
            <Input label="Khác" {...register("other")} />
            <Input label="Tăng ca (Overtime)" {...register("overtime")} />
            <Input label="Phụ cấp ca 3" {...register("shift")} />
            <Input label="Phụ cấp ăn ca " {...register("meal")} />
            <Input
              label="Phụ cấp điện thoại / khác"
              {...register("phoneOther")}
            />
            <Input
              label="Thưởng + hỗ trợ + truy lĩnh"
              {...register("rewardSupport")}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-3">
            Khấu trừ &amp; thực lĩnh
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Các khoản trừ" {...register("deductions")} />
            <Input label="Tạm ứng " {...register("advance")} />
            <Input label="Truy thu " {...register("collection")} />
            <Input label="BHXH, BHYT, BHTN" {...register("insurance")} />
            <Input label="Thuế TNCN" {...register("tax")} />
            <Input label="Công đoàn (UnionFee)" {...register("unionFee")} />
            <Input label="Công ty (Company)" {...register("company")} />
            <Input
              label="Công ty cha (FatherCompany)"
              {...register("fatherCompany")}
            />
            <Input label="Thực lĩnh" {...register("netAmount")} />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-3">
            Dự phòng
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Reserve 1" {...register("reserve1")} />
            <Input label="Reserve 2" {...register("reserve2")} />
            <Input label="Reserve 3" {...register("reserve3")} />
            <Input label="Reserve 4" {...register("reserve4")} />
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
