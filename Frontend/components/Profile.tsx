"use client"
import {getProfile} from "@/lib/api";
import {useQuery} from "@tanstack/react-query";
import {Stack, Text, Box, ActionIcon} from "@mantine/core";
import {IconMail, IconUser } from "@tabler/icons-react";

const Profile = () => {

    const { data: profile } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const res = await getProfile();
            return res.data;
        },
    })

    return (
        <Stack gap="md"  p={8} className="shadow-slate-700 absolute right-2 top-24 shadow-sm">
            <Box className="flex gap-4">
                <ActionIcon
                variant="outline"
                color="slate"
                >
                 <IconMail />
                </ActionIcon>
                <Text size="sm">{profile?.email}</Text>
            </Box>
            <Box className="flex gap-4">
                <ActionIcon
                variant="outline"
                color="slate"
                >
                 <IconUser />
                </ActionIcon>
                <Text size="sm">{profile?.role}</Text>
            </Box>
        </Stack>
    )
}
export default Profile
