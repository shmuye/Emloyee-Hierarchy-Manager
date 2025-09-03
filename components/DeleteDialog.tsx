"use client";

import { Button, Dialog, Group, Text, Title, Stack } from "@mantine/core";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useQueryClient, useMutation} from "@tanstack/react-query";
import { getPositionById, deletePosition } from "@/lib/api";
import { Position } from "@/types/position";

interface DeleteDialogProps {
    opened: boolean;
    onClose: () => void;
}

const DeleteDialog = ({ opened, onClose }: DeleteDialogProps) => {
    const router = useRouter();
    const { id } = useParams();
    const positionId = id as string;
    const queryClient = useQueryClient();


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
            router.push("/");
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

                <Text size="sm" c="dimmed">
                    Are you sure you want to delete{" "}
                    <Text span fw={600} c="dark">
                        {position.name}
                    </Text>
                    ?
                </Text>

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
