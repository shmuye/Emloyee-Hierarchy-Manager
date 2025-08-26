"use client";

import { Modal, TextInput, Button, Group } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { editPosition } from "@/store/slices/positionSlice";
import { useParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
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

    const handleEdit = async (data: { name: string; description: string }) => {

        if (data.name === position?.name && data.description === position?.description) {
            onClose(); // just close modal, don’t dispatch
            return;
        }

        await dispatch(editPosition({ id: positionId, data }));
        onClose();
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
                    render={({ field, fieldState }) => (
                        <TextInput
                            label="Position Name"
                            placeholder="Enter name"
                            {...field}
                            error={fieldState.error?.message}
                        />
                    )}
                />

                <Controller
                    name="description"
                    control={control}
                    rules={{
                        required: "Description is required",
                        minLength: { value: 5, message: "Description must be at least 5 chars" },
                    }}
                    render={({ field, fieldState }) => (
                        <TextInput
                            label="Description"
                            placeholder="Enter description"
                            {...field}
                            error={fieldState.error?.message}
                        />
                    )}
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
