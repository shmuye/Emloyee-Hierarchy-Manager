"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import useRouter from "next/router";
import Link from "next/link";

import {
    Button,
    TextInput,
    PasswordInput,
    Select,
    Box,
    Stack,
    Anchor,
    Title,
} from "@mantine/core";

const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["OrgAdmin", "User"]), // ✅ enforce valid role
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = ()=> {
    const router = useRouter;
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            role: "User", // default role
        },
    });

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            console.log("✅ Registered:", data.data);
            router.push('/')
            // TODO: maybe redirect to login or dashboard
        },
        onError: (err: unknown) => {
            if (err instanceof Error) {
                console.error("❌ Register failed", err.message);
            } else {
                console.error("❌ Register failed", err);
            }
        },

    });

    const onSubmit = (values: RegisterFormValues) => {
        mutation.mutate(values);
    };

    return (
        <Box maw={400} mx="auto" mt="xl">
            <Title order={2} mb="md">Sign Up</Title>
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

                    {/* 👇 Add login link */}
                    <Anchor component={Link} href="/auth/login" size="sm" >
                        Already have an account? Login
                    </Anchor>
                </Stack>
            </form>
        </Box>
    );
}
export default RegisterPage;