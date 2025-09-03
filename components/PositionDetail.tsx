"use client";

import { useState } from "react";
import {useQuery} from "@tanstack/react-query";
import  { getPositions, getPositionById} from "@/lib/api";
import { useParams } from "next/navigation";
import {Position} from "@/types/position";
import {
    ActionIcon,
    Tooltip,
    Group,
    Card,
    Title,
    Text,
    Divider,
    Badge,
    Stack,
    Box,
    LoadingOverlay,
} from "@mantine/core";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import DeleteDialog from "@/components/DeleteDialog";
import EditModal from "@/components/EditModal";

const PositionDetail = () => {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id ?? "";
    console.log(id)

    const { data: position, isLoading, error } = useQuery({
        queryKey: ["position", id],
        queryFn: async () => {
            const res = await getPositionById(id);
            return res.data.position;
        },
    });



    const { data: positionsData } = useQuery({
        queryKey: ["positions"],
        queryFn: async () => {
            const res = await getPositions();
            return res.data;
        },
    });
    const positions: Position[] = positionsData?.tree || []

    const [deleteDialog, setDeleteDialog] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const parentPosition = positions?.find((p) => p.id === position?.parentId);
    const parentName = parentPosition ? parentPosition.name : "Root Position";

    if (isLoading) return (
        <Box p="md">
            <LoadingOverlay visible />
            <Text c="dimmed">Loading position...</Text>
        </Box>
    );

    if (error instanceof Error) return (
        <Box p="md">
            <Text c="red">Error: {error.message}</Text>
        </Box>
    );

    return (
        <Card withBorder shadow="md" radius="lg" className="w-[80%] md:w-[60%] mx-auto mt-16">
            <Group justify="space-between" mb="md">
                <Link href="/" passHref>
                    <Tooltip label="Back to Home" withArrow>
                        <ActionIcon variant="light" color="blue" radius="xl" size="lg">
                            <ArrowLeft size={20} />
                        </ActionIcon>
                    </Tooltip>
                </Link>

                <Group gap="xs">
                    <Tooltip label="Edit Position" withArrow>
                        <ActionIcon
                            variant="light"
                            color="green"
                            radius="xl"
                            size="lg"
                            onClick={() => setEditModal(true)}
                        >
                            <Pencil size={20} />
                        </ActionIcon>
                    </Tooltip>

                    <Tooltip label="Delete Position" withArrow>
                        <ActionIcon
                            variant="light"
                            color="red"
                            radius="xl"
                            size="lg"
                            onClick={() => setDeleteDialog(true)}
                        >
                            <Trash2 size={20} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Group>

            <Stack gap="xs">
                <Title order={2} c="dark">{position?.name}</Title>
                <Text size="sm" c="dimmed">{position?.description}</Text>
            </Stack>

            <Divider my="md" />

            {position?.parentId ? (
                <Text size="sm" c="gray" fw="bold">Reports to: {parentName}</Text>
            ) : (
                <Badge color="teal" radius="sm" variant="light">Root Position</Badge>
            )}

            <DeleteDialog opened={deleteDialog} onClose={() => setDeleteDialog(false)} />
            <EditModal opened={editModal} onClose={() => setEditModal(false)} />
        </Card>
    );
};

export default PositionDetail;