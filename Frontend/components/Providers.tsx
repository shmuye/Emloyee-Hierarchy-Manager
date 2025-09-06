"use client";

import { QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {MantineProvider} from "@mantine/core";
import {AuthProvider} from "@/context/AuthContext";

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </MantineProvider>
        </QueryClientProvider>
    );
}
