"use client";

import { Modal, Button, TextInput, Select, Alert } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPosition, getPositions } from "@/lib/api";
import { useState } from "react";
import { flattenPositions }   from '@/lib/flattenTree'


type FormData = {
    name: string;
    description: string;
    parentId?: string | null;
};

type AddPositionModalProps = {
    parentId?: string | null; // ✅ for Add Child
    trigger?: React.ReactNode; // ✅ allow custom open button
};

const AddPositionModal = ({ parentId = null, trigger }: AddPositionModalProps) => {
    const queryClient = useQueryClient();
    const [opened, setOpened] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    const { data: positions } = useQuery({
        queryKey: ["positions"],
        queryFn: async () => {
            const res = await getPositions();
            return res.data;
        },
    });

    const mutation = useMutation({
        mutationFn: createPosition,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["positions"] });
            setOpened(false);
            reset();
            setStatus("Position added successfully")
        },
        onError: (err: any) => {
            let message = "Something went wrong.";

            if (err?.response?.status === 401) {
                // Unauthorized
                message = "You must be logged in to perform this action.";
            } else if (err?.response?.status === 403) {
                // Forbidden
                message = "You don’t have permission to delete this position.";
            } else if (err?.response?.data?.error) {
                message = err.response.data.error;
            } else if(err?.code === "23505"){
                message = "Position name already exists"
            }


            setStatus(message);
        },
    });

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: { parentId }, // ✅ prefill parentId
    });

    const onSubmit = (data: FormData) => {
        mutation.mutate({
            name: data.name,
            description: data.description,
            parentId: parentId || data.parentId || null,
        });
    };

    return (
        <>
            {trigger ? (
                <span onClick={() => setOpened(true)}>{trigger}</span>
            ) : (
                <Button color="slate" variant="subtle" onClick={() => setOpened(true)}>
                    Add Position
                </Button>
            )}

            <Modal opened={opened} onClose={() => setOpened(false)} title="Add New Position" centered>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <TextInput
                        label="Position Name"
                        placeholder="e.g. Software Engineer"
                        {...register("name", { required: "Name is required" })}
                        error={errors.name?.message}
                    />

                    <TextInput
                        label="Description"
                        placeholder="Short description..."
                        {...register("description", { required: "Description is required" })}
                        error={errors.description?.message}
                    />

                    {/* Only show Parent selector if parentId was not passed */}
                    {!parentId && (
                        <Controller
                            name="parentId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Parent Position"
                                    placeholder="Pick one"
                                    data={
                                        positions?.tree ? flattenPositions(positions.tree) : []
                                    }
                                    value={field.value?.toString() ?? null}
                                    onChange={(val) => field.onChange(val || null)}
                                    clearable
                                />
                            )}
                        />
                    )}

                    {status && (
                        <Alert
                            color={status.includes("successfully") ? "green" : "red"}
                            variant="light"
                        >
                            {status}
                        </Alert>
                    )}

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
