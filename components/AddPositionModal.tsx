"use client";

import { Modal, Button, TextInput, Select } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { addPosition } from "@/store/slices/positionSlice";
import { useState } from "react";

type FormData = {
    name: string;
    description: string;
    parentId?: string | null;
};

const AddPositionModal = () => {
    const dispatch = useAppDispatch();
    const { positions } = useAppSelector((state) => state.positions);

    const [opened, setOpened] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        await dispatch(
            addPosition({
                name: data.name,
                description: data.description,
                parentId: data.parentId ? Number(data.parentId) : null,
            })
        );
        reset();
        setOpened(false);
    };

    return (
        <>
            {/* Trigger button */}
            <Button variant="filled" onClick={() => setOpened(true)}>
                Add Position
            </Button>

            {/* Modal with form */}
            <Modal opened={opened} onClose={() => setOpened(false)} title="Add New Position" centered>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <TextInput
                        label="Position Name"
                        placeholder="e.g. Software Engineer"
                        {...register("name", { required: "Name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } })}
                        error={errors.name?.message}
                    />

                    {/* Description */}
                    <TextInput
                        label="Description"
                        placeholder="Short description..."
                        {...register("description", { required: "Description is required", minLength: { value: 5, message: "Description must be at least 5 characters" } })}
                        error={errors.description?.message}
                    />

                    {/* Parent Position dropdown */}
                    <Controller
                        name="parentId"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Select
                                label="Parent Position"
                                placeholder="Pick one"
                                data={positions.map((p) => ({ value: String(p.id), label: p.name }))}
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                error={fieldState.error?.message}
                                clearable
                            />
                        )}
                    />

                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setOpened(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default AddPositionModal;
