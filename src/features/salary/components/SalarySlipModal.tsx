import { useRef } from "react";
import { Printer } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { SalaryResponse } from "../types";
import { calcNgayCongFromYearMonth } from "../utils/workingDays";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    salary: SalaryResponse | null;
}

/** "202502" → { month: 2, year: 2025 } */
function parseYearMonth(ym: string): { month: number; year: number } {
    const year = parseInt(ym.substring(0, 4), 10);
    const month = parseInt(ym.substring(4, 6), 10);
    return { month, year };
}

function fmt(value: string | number | null | undefined): string {
    if (value == null || value === "") return "—";
    const num = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ""));
    if (!isNaN(num) && String(value).trim() !== "") {
        return num.toLocaleString("vi-VN");
    }
    return String(value);
}

function SlipSeparator() {
    return (
        <tr>
            <td colSpan={2} className="border-t border-slate-300 py-1" />
        </tr>
    );
}

function SlipRow({
    label,
    value,
    bold,
    indent,
}: {
    label: string;
    value?: string | number | null;
    bold?: boolean;
    indent?: boolean;
}) {
    const displayVal = value != null && value !== "" ? fmt(value) : "—";
    return (
        <tr className={bold ? "font-semibold" : ""}>
            <td className={`py-0.5 pr-4 text-sm ${indent ? "pl-6" : ""} text-slate-700 whitespace-nowrap`}>
                {label}
            </td>
            <td className={`py-0.5 text-sm text-right ${bold ? "text-slate-900" : "text-slate-700"} tabular-nums`}>
                {displayVal}
            </td>
        </tr>
    );
}

export function SalarySlipModal({ isOpen, onClose, salary }: Props) {
    const printRef = useRef<HTMLDivElement>(null);

    const { month, year } = salary
        ? parseYearMonth(salary.yearMonth)
        : { month: 0, year: 0 };
    const ngayCong = salary ? calcNgayCongFromYearMonth(salary.yearMonth) : null;

    function handlePrint() {
        if (!printRef.current || !salary) return;
        const content = printRef.current.innerHTML;
        const win = window.open("", "_blank", "width=600,height=800");
        if (!win) return;
        win.document.write(`<!DOCTYPE html><html lang="vi"><head>
            <meta charset="utf-8"/>
            <title>Phiếu lương ${salary.yearMonth}</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Times New Roman', serif; }
                body { padding: 20px; font-size: 12pt; color: #111; }
                table { width: 100%; border-collapse: collapse; }
                td { padding: 3px 6px; }
                .text-right { text-align: right; }
                .bold { font-weight: bold; }
                .indent { padding-left: 24px; }
                .separator { border-top: 1px solid #555; height: 6px; }
                h2 { text-align: center; font-size: 14pt; margin-bottom: 4px; }
                .meta { margin-bottom: 12px; font-size: 11pt; }
                .section-label { font-weight: bold; border-bottom: 1px solid #555; margin: 8px 0 4px; }
                .net { font-size: 13pt; font-weight: bold; border-top: 2px solid #222; margin-top: 8px; padding-top: 4px; }
            </style>
        </head><body>${content}</body></html>`);
        win.document.close();
        win.focus();
        win.print();
        win.close();
    }

    if (!salary) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Phiếu lương tháng ${month} năm ${year}`}
            size="lg"
        >
            {/* Print area */}
            <div ref={printRef}>
                {/* Header */}
                <div className="text-center mb-4">
                    <p className="text-xs text-slate-500 uppercase tracking-widest">
                        {salary.company ?? "CÔNG TY"}
                    </p>
                    <h2 className="text-xl font-bold text-slate-900 mt-1">
                        PHIẾU LƯƠNG THÁNG {month} NĂM {year}
                    </h2>
                </div>

                {/* Employee info */}
                <div className="mb-4 grid grid-cols-2 gap-1 text-sm border border-slate-200 rounded-lg p-3 bg-slate-50">
                    <div>
                        <span className="text-slate-500">Mã nhân viên:</span>{" "}
                        <span className="font-medium text-slate-900">{salary.employeeId ?? "—"}</span>
                    </div>
                    <div>
                        <span className="text-slate-500">Kỳ lương:</span>{" "}
                        <span className="font-medium text-slate-900">
                            {String(month).padStart(2, "0")}/{year}
                        </span>
                    </div>
                    <div className="col-span-2">
                        <span className="text-slate-500">Họ và tên:</span>{" "}
                        <span className="font-medium text-slate-900">{salary.employeeName ?? "—"}</span>
                    </div>
                    <div>
                        <span className="text-slate-500">Ngạch:</span>{" "}
                        <span className="font-medium text-slate-900">{salary.salaryCategory ?? "—"}</span>
                    </div>
                    <div>
                        <span className="text-slate-500">Bậc:</span>{" "}
                        <span className="font-medium text-slate-900">{salary.salaryRank ?? "—"}</span>
                    </div>
                    <div>
                        <span className="text-slate-500">Ngày công:</span>{" "}
                        <span className="font-medium text-slate-900">
                            {ngayCong != null ? ngayCong : "—"}
                        </span>
                    </div>
                    <div>
                        <span className="text-slate-500">Đơn vị:</span>{" "}
                        <span className="font-medium text-slate-900">{salary.fatherCompany ?? "—"}</span>
                    </div>
                </div>

                <table className="w-full">
                    <tbody>
                        {/* ── Thu nhập ── */}
                        <SlipRow label="CÁC KHOẢN THU NHẬP" value={salary.income} bold />
                        <SlipRow label="Lương hệ số" value={salary.coefficient} indent />
                        <SlipRow label="Trách nhiệm" value={salary.responsibility} indent />
                        <SlipRow label="Thâm niên" value={salary.seniority} indent />
                        <SlipRow label="PC độc hại" value={salary.toxic} indent />
                        <SlipRow label="Khác" value={salary.other} indent />
                        <SlipRow label="Số công" value={salary.workingDay} indent />
                        <SlipRow label="Tăng ca" value={salary.overtime} indent />
                        <SlipRow label="Phụ cấp ca 3" value={salary.shift} indent />
                        <SlipRow label="Phụ cấp ăn ca" value={salary.meal} indent />
                        <SlipRow label="Phụ cấp điện thoại + khác" value={salary.phoneOther} indent />
                        <SlipRow label="Thưởng + hỗ trợ + truy lĩnh" value={salary.rewardSupport} indent />

                        <SlipSeparator />

                        {/* ── Khấu trừ ── */}
                        <SlipRow label="CÁC KHOẢN TRỪ" value={salary.deductions} bold />
                        <SlipRow label="Tạm ứng" value={salary.advance} indent />
                        <SlipRow label="Truy thu" value={salary.collection} indent />
                        <SlipRow label="BHXH, BHYT, BHTN" value={salary.insurance} indent />
                        <SlipRow label="Thuế TNCN" value={salary.tax} indent />
                        {salary.unionFee && (
                            <SlipRow label="Công đoàn phí" value={salary.unionFee} indent />
                        )}

                        <SlipSeparator />

                        {/* ── Thực lĩnh ── */}
                        <tr className="bg-slate-50">
                            <td className="py-2 pl-2 text-base font-bold text-slate-900">
                                THỰC LĨNH
                            </td>
                            <td className="py-2 text-right text-base font-bold text-primary-700 tabular-nums">
                                {fmt(salary.netAmount)}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Note rows if any */}
                {(salary.reserve1 || salary.reserve2 || salary.reserve3 || salary.reserve4) && (
                    <div className="mt-3 text-xs text-slate-500 border-t pt-2 space-y-0.5">
                        {salary.reserve1 && <p>Ghi chú 1: {salary.reserve1}</p>}
                        {salary.reserve2 && <p>Ghi chú 2: {salary.reserve2}</p>}
                        {salary.reserve3 && <p>Ghi chú 3: {salary.reserve3}</p>}
                        {salary.reserve4 && <p>Ghi chú 4: {salary.reserve4}</p>}
                    </div>
                )}
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-slate-200">
                <Button variant="secondary" type="button" onClick={onClose}>
                    Đóng
                </Button>
                <Button type="button" onClick={handlePrint}>
                    <Printer className="w-4 h-4" />
                    In phiếu
                </Button>
            </div>
        </Modal>
    );
}
