"use client";

import { Modal, Button, TextInput, Select } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import { createPosition, getPositions} from "@/lib/api";
import { useState } from "react";

type FormData = {
    name: string;
    description: string;
    parentId?: string | null;
};

const AddPositionModal = () => {

    const queryClient = useQueryClient();
    const [opened, setOpened] = useState(false);
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
        },
    });

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        mutation.mutate(
            ({
                name: data.name,
                description: data.description,
                parentId: data.parentId || null,
            })
        );
        reset();
        setOpened(false);
    };

    return  (
        <>
            <Button variant="filled" onClick={() => setOpened(true)}>Add Position</Button>
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

                    <Controller
                        name="parentId"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Parent Position"
                                placeholder="Pick one"
                                data={positions?.map((p) => ({ value: String(p.id), label: p.name })) || []}
                                value={field.value?.toString() ?? null}
                                onChange={(val) => field.onChange(val ? Number(val) : null)}
                                clearable
                            />
                        )}
                    />

                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setOpened(false)}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default AddPositionModal;
