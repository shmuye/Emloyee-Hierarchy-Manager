"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchPositionById } from "@/store/slices/positionSlice";
import { useParams } from "next/navigation";
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
} from "@mantine/core";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import DeleteDialog from "@/components/DeleteDialog";
import EditModal from "@/components/EditModal";

const PositionDetail = () => {
    const { positions, loading, error } = useAppSelector((state) => state.positions);
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const positionId = parseInt(id as string);

    const [deleteDialog, setDeleteDialog] = useState(false);
    const [editModal, setEditModal] = useState(false);

    useEffect(() => {
        if (!isNaN(positionId)) {
            dispatch(fetchPositionById(positionId));
        }
    }, [dispatch, positionId]);

    const position = positions.find((p) => p.id === positionId);
    if (loading) return <Text  component="div"   c="dimmed" p="md">Loading position...</Text>;
    if (error) return <Text  component="div"     c="red" p="md">Error: {error}</Text>;
    if (!position) return <Text component="div"  c="dimmed" p="md">Position not found.</Text>;

    return (
        <Card
            withBorder
            shadow="md"
            radius="lg"
            className="w-[80%] md:w-[60%] mx-auto mt-16"
        >
            {/* Header actions */}
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

            {/* Position Details */}
            <Stack gap="xs">
                <Title order={2} c="dark">
                    {position.name}
                </Title>
                <Text size="sm" c="dimmed">
                    {position.description}
                </Text>
            </Stack>

            <Divider my="md" />

            {position.parentId ? (
                <Text size="sm" c="gray">
                    Reports to:{" "}
                    <Badge color="blue" radius="sm" variant="light">
                        {position.parentId}
                    </Badge>
                </Text>
            ) : (
                <Badge color="teal" radius="sm" variant="light">
                    Root Position
                </Badge>
            )}


            <DeleteDialog opened={deleteDialog} onClose={() => setDeleteDialog(false)} />


            <EditModal opened={editModal} onClose={() => setEditModal(false)} />
        </Card>
    );
};

export default PositionDetail;
