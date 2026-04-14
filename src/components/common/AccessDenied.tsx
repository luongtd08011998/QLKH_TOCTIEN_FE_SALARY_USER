import { ShieldX, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface AccessDeniedProps {
    message?: string;
}

export function AccessDenied({
    message = "You do not have permission to access this resource.",
}: AccessDeniedProps) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                <ShieldX className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Access Denied
            </h2>
            <p className="text-slate-500 max-w-md mb-8">{message}</p>
            <Link
                to="/admin"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>
        </div>
    );
}
