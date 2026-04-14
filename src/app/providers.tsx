import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/config/queryClient";
import { AuthInitializer } from "./AuthInitializer";
import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthInitializer>
                {children}
                <Toaster position="top-right" />
            </AuthInitializer>
        </QueryClientProvider>
    );
}

