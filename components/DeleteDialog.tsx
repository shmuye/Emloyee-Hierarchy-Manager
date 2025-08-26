"use client";

import { Button, Dialog, Group, Text, Title, Stack } from "@mantine/core";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { removePosition } from "@/store/slices/positionSlice";

interface DeleteDialogProps {
    opened: boolean;
    onClose: () => void;
}

const DeleteDialog = ({ opened, onClose }: DeleteDialogProps) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { positions } = useAppSelector((state) => state.positions);
    const { id } = useParams();
    const positionId = parseInt(id as string);

    const position = positions.find((p) => p.id === positionId);

    const handleDelete = async () => {
        await dispatch(removePosition(positionId));
        onClose();
        router.push("/"); // redirect after deletion
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
                    <Button color="red" onClick={handleDelete}>
                        Delete
                    </Button>
                </Group>
            </Stack>
        </Dialog>
    );
};

export default DeleteDialog;
