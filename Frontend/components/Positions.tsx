"use client";

import { useQuery } from "@tanstack/react-query";
import { getPositions } from "@/lib/api";
import TreeNode from "@/components/TreeNode";

import { Container, Title, Paper, Loader, Text } from "@mantine/core";

const Positions = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["positions"],
        queryFn: async () => {
            const res = await getPositions();
            return res.data;
        },
    });

    if (isLoading) return <Loader color="blue" />;
    if (error instanceof Error) return <Text c="red">{error.message}</Text>;

    const tree = data?.tree || [];

    return (
        <Container size="md" py="xl">
            <Title order={2} mb="md">
                Organization Structure
            </Title>

            <Paper shadow="sm" radius="md" p="md" withBorder style={{ maxHeight: "80vh", overflowY: "auto" }}>
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {tree.map((root) => (
                        <TreeNode key={root.id} node={root} />
                    ))}
                </ul>
            </Paper>
        </Container>
    );
};

export default Positions;
