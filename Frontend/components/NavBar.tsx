"use client";

import AddPositionModal from "@/components/AddPositionModal";
import Link from "next/link";
import { Button, Group, Avatar } from "@mantine/core";
import { useAuth } from "@/context/AuthContext";
import Profile  from "@/components/Profile";
import { useState } from "react";

const NavBar = () => {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState<boolean>(false);
    return (
        <header className="py-4 px-2  border-b-2 border-slate-200  text-slate-900 bg-card">
            <nav className="flex justify-between px-4 items-center">
                <h1 className="sm:text-[16px] md:text-xl font-bold">EHM</h1>

                <Group>
                    {user &&
                        <>
                            {user.role === "OrgAdmin" && <AddPositionModal />}
                            <Button variant="subtle" color="slate" onClick={logout}>
                                Logout
                            </Button>
                            <Avatar onClick={() => setOpen( !open)} />
                            {
                                open && <Profile />
                            }

                        </>


                    }

                    {!user && (
                        <>
                            <Button
                                component={Link}
                                href="/auth/login"
                                variant="outline"
                                color="blue"
                            >
                                Login
                            </Button>
                            <Button
                                component={Link}
                                href="/auth/register"
                                variant="filled"
                                color="Blue"
                            >
                                Sign Up
                            </Button>

                        </>
                    ) }

                        </Group>

            </nav>
        </header>
    );
};

export default NavBar;
