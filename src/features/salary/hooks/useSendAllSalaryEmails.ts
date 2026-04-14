import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { salaryApi } from "../api";

export function useSendAllSalaryEmails() {
    return useMutation({
        mutationFn: (yearMonth: string) =>
            salaryApi.sendAll(yearMonth).then((res) => res.data),
        onSuccess: (data) => {
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
        },
        onError: (err: unknown) => {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                "Gửi email hàng loạt thất bại.";
            toast.error(message);
        },
    });
}
