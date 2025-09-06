"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {registerUser} from "@/lib/api";

interface User {
    id: string;
    email: string;
    role: "OrgAdmin" | "User";
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    register: (email: string, password: string, role: "OrgAdmin" | "User") => Promise<void>;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        // Load from localStorage on mount
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (token: string, user: User) => {
        setToken(token);
        setUser(user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
    };

    const register = async (email: string, password: string, role: "OrgAdmin" | "User") => {
        try {
            const res = await registerUser({ email, password, role });
            // store user and token
            setUser({
                id: res.data.user.id,
                email: res.data.user.email,
                role: res.data.user.role
            });
            localStorage.setItem("token", res.data.token);
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw new Error(err.message);
            }
            throw new Error("Registration failed");
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        queryClient.clear(); // optional: clear React Query cache
    };

    return (
        <AuthContext.Provider value={{ user, token, login,register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
