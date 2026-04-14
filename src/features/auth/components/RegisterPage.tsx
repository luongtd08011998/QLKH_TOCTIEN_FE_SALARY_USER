import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { useRegister } from "../hooks/useRegister";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { GENDER_OPTIONS } from "@/config/constants";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/utils/error";

const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    age: z.string().optional(),
    gender: z.string().optional(),
    address: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
    const navigate = useNavigate();
    const registerMutation = useRegister();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    function onSubmit(data: RegisterFormData) {
        const payload = {
            name: data.name,
            email: data.email,
            password: data.password,
            age: data.age ? Number(data.age) : undefined,
            gender:
                data.gender
                    ? (data.gender as "MALE" | "FEMALE" | "OTHER")
                    : undefined,
            address: data.address || undefined,
        };

        registerMutation.mutate(payload, {
            onSuccess: () => {
                toast.success("\u0110\u0103ng k\u00fd t\u00e0i kho\u1ea3n th\u00e0nh c\u00f4ng");
                navigate("/login");
            },
            onError: (error) => {
                toast.error(getErrorMessage(error, "L\u1ed7i \u0111\u0103ng k\u00fd"));
            }
        });
    }

    const errorMessage = registerMutation.error ? getErrorMessage(registerMutation.error) : null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 px-4 py-8">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white text-2xl font-bold mb-4 shadow-lg shadow-primary-500/25">
                        HR
                    </div>
                    <h1 className="text-2xl font-bold text-white">Create account</h1>
                    <p className="text-slate-400 mt-1">Register for HR Admin Dashboard</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {errorMessage && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Full Name"
                            placeholder="Nguyen Van A"
                            error={errors.name?.message}
                            {...register("name")}
                        />

                        <Input
                            label="Email"
                            type="email"
                            placeholder="user@example.com"
                            error={errors.email?.message}
                            autoComplete="email"
                            {...register("email")}
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="At least 8 characters"
                                error={errors.password?.message}
                                autoComplete="new-password"
                                {...register("password")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[34px] p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Age"
                                type="number"
                                placeholder="25"
                                error={errors.age?.message}
                                {...register("age")}
                            />
                            <Select
                                label="Gender"
                                options={[...GENDER_OPTIONS]}
                                placeholder="Select"
                                error={errors.gender?.message}
                                {...register("gender")}
                            />
                        </div>

                        <Input
                            label="Address"
                            placeholder="Ho Chi Minh City"
                            error={errors.address?.message}
                            {...register("address")}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            isLoading={registerMutation.isPending}
                        >
                            <UserPlus className="w-4 h-4" />
                            Create account
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const Component = RegisterPage;
