import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { salaryApi } from "../api";
import type { SalarySendStatus } from "../types";

export function useSendAllSalaryEmails() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (vars: {
            yearMonth: string;
            sendStatus?: Extract<SalarySendStatus, "UNSENT" | "FAILED">;
        }) => salaryApi.sendAll(vars.yearMonth, vars.sendStatus).then((res) => res.data),
        onSuccess: async (data) => {
            const result = data.data;
            if (result && result.failCount === 0 && result.successCount > 0) {
                toast.success(`Đã gửi thành công ${result.successCount} phiếu lương!`);
            } else if (result && (result.successCount > 0 || result.failCount > 0)) {
                toast.success(
                    `Gửi xong: ${result.successCount} thành công, ${result.failCount} thất bại. Xem chi tiết bên dưới.`,
                );
            } else if (result?.errors?.length) {
                toast.error(result.errors[0] ?? "Không gửi được phiếu lương nào.");
            }
            await qc.invalidateQueries({ queryKey: ["salaries"] });
        },
        onError: (err: unknown) => {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                "Gửi email hàng loạt thất bại.";
            toast.error(message);
        },
    });
}
