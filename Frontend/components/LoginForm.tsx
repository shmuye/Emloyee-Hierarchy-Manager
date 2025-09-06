"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextInput, PasswordInput, Button, Stack, Anchor } from "@mantine/core";
import { login as loginApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from 'react'

const loginSchema = z.object({
    email: z.email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginInput = z.infer<typeof loginSchema>;
export const LoginForm = ( ) => {
    const { login } = useAuth();
    const router = useRouter();
    const [status, setStatus] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            const res = await loginApi(data);
            const { token, user } = res.data;
            login(token, user);
            setStatus("Login Successful")
            router.push("/");
        } catch (err: unknown) {
            let errorMessage = "Login failed";
            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (typeof err === "object" && err !== null && "response" in err) {
                const Err = err as { response?: { data?: { error?: string } } };
                errorMessage = Err.response?.data?.error || errorMessage;
            }
            setStatus(errorMessage);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack>
                    <TextInput
                        label="Email"
                        placeholder="your@email.com"
                        {...register("email")}
                        error={errors.email?.message}
                        required
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        {...register("password")}
                        error={errors.password?.message}
                        required
                    />
                    <Button type="submit" fullWidth loading={isSubmitting}>
                        Login
                    </Button>
                    <Anchor component={Link} href="/auth/register" size="sm">
                        Do not have an account? Sign up
                    </Anchor>
                </Stack>
            </form>
            <h1>{status}</h1>
        </>

    );
};