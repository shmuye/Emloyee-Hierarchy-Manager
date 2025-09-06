"use client";
import {Modal, TextInput, Button, Group, Alert} from "@mantine/core";
import { getPositionById, updatePosition} from "@/lib/api";
import { useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Position } from "@/types/position";

interface EditModalProps {
    opened: boolean;
    onClose: () => void;
}

const EditModal = ({ opened, onClose }: EditModalProps) => {
    const { id } = useParams();
    const positionId = id as string;
    const queryClient = useQueryClient();
    const [status, setStatus] = useState<string | null>(null);
    const { data: position } = useQuery<Position>({
        queryKey: ["position", positionId],
        queryFn: () => getPositionById(positionId).then((res) => res.data),
        enabled: !!positionId,
    });



    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<{ name: string; description: string }>({
        defaultValues: { name: "", description: "" }, // start empty to ensure proper validation
        mode: "onSubmit", // validate on submit
    });

    // Reset form values once the position is loaded
    useEffect(() => {
        if (position) {
            reset({
                name: position.name,
                description: position.description,
            });
        }
    }, [position, reset]);

    const mutation = useMutation({
        mutationFn: (data: { name: string; description: string }) =>
            updatePosition(positionId, data).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["positions"] }); // refresh positions list
            queryClient.invalidateQueries({ queryKey: ["position", positionId] }); // refresh current one
            setStatus("Position updated successfully");
            onClose();
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

    const handleEdit = (data: { name: string; description: string }) => {
        if (
            data.name === position?.name &&
            data.description === position?.description
        ) {
            onClose();
            return;
        }
        mutation.mutate(data);
    };


    if (!position) return null;

    return (
        <Modal opened={opened} onClose={onClose} title="Edit Position" centered>
            <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
                <Controller
                    name="name"
                    control={control}
                    rules={{
                        required: "Name is required",
                        minLength: { value: 2, message: "Name must be at least 2 chars" },
                    }}
                    render={({ field }) => (
                        <TextInput
                            label="Position Name"
                            placeholder="Enter name"
                            {...field}
                            error={errors.name?.message}
                        />
                    )}
                />

                <Controller
                    name="description"
                    control={control}
                    rules={{
                        required: "Description is required",
                        minLength: {
                            value: 5,
                            message: "Description must be at least 5 chars",
                        },
                    }}
                    render={({ field }) => (
                        <TextInput
                            label="Description"
                            placeholder="Enter description"
                            {...field}
                            error={errors.description?.message}
                        />
                    )}
                />
                {status && (
                    <Alert
                        color={status.includes("successfully") ? "green" : "red"}
                        variant="light"
                    >
                        {status}
                    </Alert>
                )}

                <Group justify="end" mt="md">
                    <Button variant="default" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={mutation.isPending}>
                        Save
                    </Button>
                </Group>
            </form>
        </Modal>
    );
};

export default EditModal;
