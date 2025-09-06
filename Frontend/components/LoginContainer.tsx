"use client";
import { Box, Title } from "@mantine/core";
import { LoginForm } from "./LoginForm";
const LoginContainer = () => {
    return (
        <Box className="border-blue-500 border-2 rounded-sm p-4 mt-16" maw={400} mx="auto" >
            <Title order={2} mb="md">
                Login
            </Title>
            <LoginForm  />
        </Box>
    );
};

export default LoginContainer;