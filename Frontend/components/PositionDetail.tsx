"use client";

import { useState } from "react";
import {useQuery} from "@tanstack/react-query";
import  { getPositions, getPositionById} from "@/lib/api";
import { useParams } from "next/navigation";
import {Position} from "@/types/position";
import AddPositionModal from "@/components/AddPositionModal";
import {
    ActionIcon,
    Tooltip,
    Group,
    Card,
    Button,
    Title,
    Text,
    Divider,
    Badge,
    Flex,
    Box,
    LoadingOverlay,
} from "@mantine/core";

import { IconPencil,IconPlus, IconTrash, IconArrowLeft } from "@tabler/icons-react";

import Link from "next/link";
import DeleteDialog from "@/components/DeleteDialog";
import EditModal from "@/components/EditModal";
import {useAuth} from "@/context/AuthContext";

const PositionDetail = () => {
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const params = useParams();
    const { user }  = useAuth()
    const id = Array.isArray(params.id) ? params.id[0] : params.id ?? "";
    const { data: position, isLoading, error } = useQuery({
        queryKey: ["position", id],
        queryFn: async () => {
            const res = await getPositionById(id);
            return res.data;
        },

    });
    const { data: positionsData } = useQuery({
        queryKey: ["positions"],
        queryFn: async () => {
            const res = await getPositions();
            return res.data;
        },

    });

    if (isLoading) return (
        <Box p="md">
            <LoadingOverlay visible />
            <Text>Loading position...</Text>
        </Box>
    );

    if (error) return (
        <Box p="md">
            <Text>Error: {error.message}</Text>
        </Box>
    );

    const positions: Position[] = positionsData?.tree || []
    const parentPosition = positions?.find((p) => p.id === position?.parentId);
    const parentName = parentPosition ? parentPosition.name : "Root Position";

    const description = position?.description || "";
    const isLong = description.length > 400; // adjust limit as you like
    const displayText = showMore ? description : description.slice(0, 400);

    return (
        <Card  shadow="md" radius="lg" className="w-[80%] md:w-[60%] mx-auto mt-16">
            <Group className={"bg-slate-700 rounded-sm"} justify="space-between" p={8}>
                <Flex  gap="md"  align="center">
                    <Link href="/" passHref>
                        <Tooltip label="Back to Home" withArrow>
                            <ActionIcon variant="light" color="blue" radius="xl" size="lg">
                                <IconArrowLeft size={20} />
                            </ActionIcon>
                        </Tooltip>
                    </Link>
                    <Title c="white"  order={2}>{position?.name}</Title>
                </Flex>

                {
                    user?.role === "OrgAdmin" &&
                    <Group gap="lg">
                        <AddPositionModal
                            parentId={position?.id}
                            trigger={
                                <Tooltip label="Add Child Position" withArrow>
                                    <ActionIcon
                                        variant="subtle"
                                        radius="xl"
                                        size="md"

                                    >
                                        <IconPlus size={20} />
                                    </ActionIcon>
                                </Tooltip>
                        }
                        />
                        <Tooltip label="Edit Position" withArrow>
                            <ActionIcon
                                variant="subtle"
                                radius="xl"
                                size="md"
                                onClick={() => setEditModal(true)}
                            >
                                <IconPencil size={20} />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label="Delete Position" withArrow>
                            <ActionIcon
                                variant="subtle"
                                radius="xl"
                                size="md"
                                onClick={() => setDeleteDialog(true)}
                            >
                                <IconTrash size={20} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                }


            </Group>

            <Divider my="sm" mt={0} />
            <Text size="sm">
                {displayText}
                {isLong && !showMore && "..."}
            </Text>
            {isLong && (
                <Button
                    variant="subtle"
                    size="xs"
                    mt="xs"
                    onClick={() => setShowMore((prev) => !prev)}
                >
                    {showMore ? "Show More" : "Show Less"}
                </Button>
            )}
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