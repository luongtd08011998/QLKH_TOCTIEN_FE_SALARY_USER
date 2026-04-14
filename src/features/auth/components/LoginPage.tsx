import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useLogin } from "../hooks/useLogin";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/utils/error";

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
    const login = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    function onSubmit(data: LoginFormData) {
        login.mutate(data, {
            onSuccess: () => {
                toast.success("\u0110\u0103ng nh\u1eadp th\u00e0nh c\u00f4ng");
            },
            onError: (error) => {
                toast.error(getErrorMessage(error, "L\u1ed7i \u0111\u0103ng nh\u1eadp"));
            }
        });
    }

    const errorMessage = login.error ? getErrorMessage(login.error) : null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white text-2xl font-bold mb-4 shadow-lg shadow-primary-500/25">
                        HR
                    </div>
                    <h1 className="text-2xl font-bold text-white">Welcome back</h1>
                    <p className="text-slate-400 mt-1">Sign in to HR Admin Dashboard</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {errorMessage && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="admin@example.com"
                            error={errors.email?.message}
                            autoComplete="email"
                            {...register("email")}
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                error={errors.password?.message}
                                autoComplete="current-password"
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

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            isLoading={login.isPending}
                        >
                            <LogIn className="w-4 h-4" />
                            Sign in
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-500">
                        Don&apos;t have an account?{" "}
                        <Link
                            to="/register"
                            className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// For lazy loading in routes
export const Component = LoginPage;
