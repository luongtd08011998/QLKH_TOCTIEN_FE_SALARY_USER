import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { salaryApi } from "../api";

export function useSendSalaryEmail() {
    return useMutation({
        mutationFn: (id: number) => salaryApi.sendEmail(id).then((res) => res.data),
        onSuccess: () => {
            toast.success("Đã gửi phiếu lương qua email thành công!");
        },
        onError: (err: unknown) => {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                "Gửi email thất bại. Vui lòng thử lại.";
            toast.error(message);
        },
    });
}
