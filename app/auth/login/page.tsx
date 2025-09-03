"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextInput, PasswordInput, Button, Box, Title, Stack, Anchor } from "@mantine/core";
import { login as loginApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
});

type LoginInput = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const { login } = useAuth();
    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            const res = await loginApi(data);
            const { token, user } = res.data;
            login(token, user);
            router.push("/"); // redirect to home or dashboard
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert(err.message);
            } else if (typeof err === "object" && err !== null && "response" in err) {
                // TypeScript still doesn’t know the shape of err.response, so we can narrow it:
                const maybeErr = err as { response?: { data?: { error?: string } } };
                alert(maybeErr.response?.data?.error || "Login failed");
            } else {
                alert("Login failed");
            }
        }


    };

    return (
        <Box mx="auto" mt={50} w={400} p="md">
            <Title order={2} mb="md">Login</Title>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack>
                    <TextInput
                        label="Email"
                        placeholder="your@email.com"
                        {...register("email")}
                        error={errors.email?.message}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        {...register("password")}
                        error={errors.password?.message}
                    />
                    <Button type="submit" fullWidth loading={isSubmitting}>
                        Login
                    </Button>
                    {/* 👇 Add signup link */}
                    <Anchor component={Link} href="/auth/register" size="sm" >
                        Don’t have an account? Sign up
                    </Anchor>
                </Stack>
            </form>
        </Box>
    );
};

export default LoginPage;
