import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { salaryApi } from "../api";

export function useSendSalaryEmail() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => salaryApi.sendEmail(id).then((res) => res.data),
        onSuccess: async () => {
            toast.success("Đã gửi phiếu lương qua email thành công!");
            await qc.invalidateQueries({ queryKey: ["salaries"] });
        },
        onError: (err: unknown) => {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                "Gửi email thất bại. Vui lòng thử lại.";
            toast.error(message);
        },
    });
}
