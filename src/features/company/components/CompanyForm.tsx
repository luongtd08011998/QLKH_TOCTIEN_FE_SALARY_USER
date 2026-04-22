import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { useCreateCompany } from "../hooks/useCreateCompany";
import { useUpdateCompany } from "../hooks/useUpdateCompany";
import type { CompanyResponse } from "../types";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/utils/error";

const schema = z.object({
    name: z.string().min(1, "Company name is required"),
    address: z.string().optional(),
    logo: z.string().optional(),
    phone: z.string().optional(),
    fax: z.string().optional(),
    email: z.string().optional(),
    website: z.string().optional(),
    preferences: z.string().optional(),
    directorName: z.string().optional(),
    bankAccount: z.string().optional(),
    taxCode: z.string().optional(),
    locationName: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CompanyFormProps {
    isOpen: boolean;
    onClose: () => void;
    company: CompanyResponse | null;
}

export function CompanyForm({ isOpen, onClose, company }: CompanyFormProps) {
    const isEdit = company !== null;
    const create = useCreateCompany();
    const update = useUpdateCompany();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const logoValue = watch("logo");

    useEffect(() => {
        if (isOpen) {
            if (company) {
                reset({
                    name: company.name,
                    address: company.address ?? "",
                    logo: company.logo ?? "",
                    phone: company.phone ?? "",
                    fax: company.fax ?? "",
                    email: company.email ?? "",
                    website: company.website ?? "",
                    preferences: company.preferences ?? "",
                    directorName: company.directorName ?? "",
                    bankAccount: company.bankAccount ?? "",
                    taxCode: company.taxCode ?? "",
                    locationName: company.locationName ?? "",
                });
            } else {
                reset({
                    name: "",
                    address: "",
                    logo: "",
                    phone: "",
                    fax: "",
                    email: "",
                    website: "",
                    preferences: "",
                    directorName: "",
                    bankAccount: "",
                    taxCode: "",
                    locationName: "",
                });
            }
        }
    }, [isOpen, company, reset]);

    function onSubmit(data: FormData) {
        const payload = {
            name: data.name,
            address: data.address || undefined,
            logo: data.logo || undefined,
            phone: data.phone || undefined,
            fax: data.fax || undefined,
            email: data.email || undefined,
            website: data.website || undefined,
            preferences: data.preferences || undefined,
            directorName: data.directorName || undefined,
            bankAccount: data.bankAccount || undefined,
            taxCode: data.taxCode || undefined,
            locationName: data.locationName || undefined,
        };

        if (isEdit && company) {
            update.mutate(
                { id: company.id, ...payload },
                {
                    onSuccess: () => {
                        toast.success("C\u1eadp nh\u1eadt c\u00f4ng ty th\u00e0nh c\u00f4ng");
                        onClose();
                    },
                    onError: (error) => {
                        toast.error(getErrorMessage(error, "L\u1ed7i c\u1eadp nh\u1eadt c\u00f4ng ty"));
                    }
                }
            );
        } else {
            create.mutate(
                payload,
                {
                    onSuccess: () => {
                        toast.success("Th\u00eam c\u00f4ng ty th\u00e0nh c\u00f4ng");
                        onClose();
                    },
                    onError: (error) => {
                        toast.error(getErrorMessage(error, "L\u1ed7i th\u00eam c\u00f4ng ty"));
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
            title={isEdit ? "Edit Company" : "Create Company"}
        >
            {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Company Name"
                    error={errors.name?.message}
                    {...register("name")}
                />
                <Input
                    label="Address"
                    error={errors.address?.message}
                    {...register("address")}
                />
                <Input label="Phone" error={errors.phone?.message} {...register("phone")} />
                <Input label="Fax" error={errors.fax?.message} {...register("fax")} />
                <Input label="Email" error={errors.email?.message} {...register("email")} />
                <Input label="Website" error={errors.website?.message} {...register("website")} />
                <Input
                    label="Director Name"
                    error={errors.directorName?.message}
                    {...register("directorName")}
                />
                <Input
                    label="Bank Account"
                    error={errors.bankAccount?.message}
                    {...register("bankAccount")}
                />
                <Input label="Tax Code" error={errors.taxCode?.message} {...register("taxCode")} />
                <Input
                    label="Location Name"
                    error={errors.locationName?.message}
                    {...register("locationName")}
                />
                <Input
                    label="Preferences"
                    error={errors.preferences?.message}
                    {...register("preferences")}
                />
                <FileUpload
                    label="Company Logo"
                    folder="logos"
                    value={logoValue}
                    onChange={(fileName) => setValue("logo", fileName)}
                />

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
