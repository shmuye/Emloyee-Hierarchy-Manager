"use client";

import { Modal, TextInput, Button, Group } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { editPosition } from "@/store/slices/positionSlice";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface EditModalProps {
    opened: boolean;
    onClose: () => void;
}

const EditModal = ({ opened, onClose }: EditModalProps) => {
    const dispatch = useAppDispatch();
    const { positions } = useAppSelector((state) => state.positions);
    const { id } = useParams();
    const positionId = parseInt(id as string);

    const position = positions.find((p) => p.id === positionId);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<{ name: string; description: string }>({
        defaultValues: {
            name: position?.name || "",
            description: position?.description || "",
        },
    });

    useEffect(() => {
        if (position) {
            reset({
                name: position.name,
                description: position.description,
            });
        }
    }, [position, reset]);

    const handleEdit = async (data: { name: string; description: string }) => {
        await dispatch(editPosition({ id: positionId, data }));
        onClose();
    };

    if (!position) return null;

    return (
        <Modal opened={opened} onClose={onClose} title="Edit Position" centered>
            <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
                <TextInput
                    label="Position Name"
                    placeholder="Enter name"
                    {...register("name", {
                        required: "Name is required",
                        minLength: { value: 2, message: "Name must be at least 2 chars" },
                    })}
                    error={errors.name?.message}
                />

                <TextInput
                    label="Description"
                    placeholder="Enter description"
                    {...register("description", {
                        required: "Description is required",
                        minLength: { value: 5, message: "Description must be at least 5 chars" },
                    })}
                    error={errors.description?.message}
                />

                <Group justify="end" mt="md">
                    <Button variant="default" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                </Group>
            </form>
        </Modal>
    );
};

export default EditModal;
