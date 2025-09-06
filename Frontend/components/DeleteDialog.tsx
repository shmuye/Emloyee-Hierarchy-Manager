"use client";

import { Button, Dialog, Group, Text, Title, Stack, Alert } from "@mantine/core";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useQueryClient, useMutation} from "@tanstack/react-query";
import { getPositionById, deletePosition } from "@/lib/api";
import { Position } from "@/types/position";
import { useState } from "react";

interface DeleteDialogProps {
    opened: boolean;
    onClose: () => void;
}

const DeleteDialog = ({ opened, onClose }: DeleteDialogProps) => {
    const router = useRouter();
    const { id } = useParams();
    const positionId = id as string;
    const queryClient = useQueryClient();
    const [status, setStatus] = useState<string | null>(null);


    const { data: position } = useQuery<Position>({
        queryKey: ["position", positionId],
        queryFn: () => getPositionById(positionId).then((res) => res.data),
        enabled: !!positionId,
    });

    // Mutation for deletion
    const mutation = useMutation({
        mutationFn: () => deletePosition(positionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["positions"] });
            onClose();
            setStatus("Position deleted successfully");
            router.push("/");
        },
        onError: (err: any) => {
            let message = "Something went wrong, try again.";

            if (err?.response?.status === 401) {
                // Unauthorized
                message = "You must be logged in to perform this action.";
            } else if (err?.response?.status === 403) {
                // Forbidden
                message = "You don’t have permission to delete this position.";
            } else if (err?.response?.data?.error) {
                message = err.response.data.error;
            } else if (err.message) {
                message = err.message;
            }

            setStatus(message);
        },

    });

    const handleDelete = () => {
        mutation.mutate();
    };

    if (!position) return null;

    return (
        <Dialog
            opened={opened}
            onClose={onClose}
            radius="md"
            withCloseButton
            size="md"
            className="w-[90%] md:w-[400px] mx-auto"
        >
            <Stack gap="sm">
                <Title order={4} c="red">
                    Confirm Delete
                </Title>

                <Text size="sm">
                    Are you sure you want to delete{" "}
                    <Text span fw={600} c="dark">
                        {position.name}
                    </Text>
                    ?
                </Text>

                {status && (
                    <Alert
                        color={status.includes("successfully") ? "green" : "red"}
                        variant="light"
                    >
                        {status}
                    </Alert>
                )}

                <Group justify="end" mt="sm">
                    <Button variant="default" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        color="red"
                        onClick={handleDelete}
                        loading={mutation.isPending}
                    >
                        Delete
                    </Button>
                </Group>
            </Stack>
        </Dialog>
    );
};

export default DeleteDialog;
