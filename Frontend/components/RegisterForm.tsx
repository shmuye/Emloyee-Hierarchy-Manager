"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Button,
    TextInput,
    PasswordInput,
    Select,
    Stack,
    Anchor,
} from "@mantine/core";
import {useState} from "react";

export const registerSchema = z.object({
    email: z.email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["OrgAdmin", "User"]),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
    const router = useRouter();
    const [status, setStatus] = useState<string | null>(null);
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {

            email: "",
            password: "",
            role: "User",
        },
    });

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            setStatus("Registration successful!");
            router.push('/')
        },
        onError: (err: unknown) => {
            if (err instanceof Error) {
                setStatus(err.message);
            } else {
                setStatus("Registration failed");
            }
        },
    });

    const onSubmit = (values: RegisterFormValues) => {
        mutation.mutate(values);
    };

    return (
        <>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Stack>
                    <TextInput
                        label="Email"
                        placeholder="Enter email"
                        {...form.register("email")}
                        error={form.formState.errors.email?.message}

                    />

                    <PasswordInput
                        label="Password"
                        placeholder="Enter password"
                        {...form.register("password")}
                        error={form.formState.errors.password?.message}
                        className="input"
                    />

                    <Select
                        label="Role"
                        data={[
                            { value: "OrgAdmin", label: "Organization Admin" },
                            { value: "User", label: "User" },
                        ]}
                        value={form.watch("role")}
                        onChange={(value) =>
                            form.setValue("role", value as "OrgAdmin" | "User")
                        }
                        error={form.formState.errors.role?.message}
                    />

                    <Button type="submit" loading={mutation.isPending}>
                        Register
                    </Button>


                    <Anchor component={Link} href="/auth/login" size="sm" >
                        Already have an account? Login
                    </Anchor>
                </Stack>
            </form>
        <h1>{status}</h1>
        </>
    );
};