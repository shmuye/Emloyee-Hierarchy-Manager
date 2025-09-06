"use client";

import { Box, Title } from "@mantine/core";
import { RegisterForm } from "./RegisterForm";

export const RegisterContainer = () => {

    return (
        <Box  className="border-blue-500 border-2 rounded-sm p-4 mt-16" maw={400} mx="auto" >
            <Title order={2} mb="md">
                Sign Up
            </Title>
            <RegisterForm />
        </Box>
    );
};