"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/auth/login"); // redirect to login if not authenticated
        }
    }, [user, router]);

    if (!user) {
        return null; // could show a loader
    }

    return <>{children}</>;
}
