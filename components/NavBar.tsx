"use client";

import AddPositionModal from "@/components/AddPositionModal";
import Link from "next/link";
import { Button, Group } from "@mantine/core";
import { useAuth } from "@/context/AuthContext";

const NavBar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="py-4 px-2 bg-slate-800 text-white bg-card">
            <nav className="flex justify-between px-4 items-center">
                <h1 className="text-xl font-bold">Employee Hierarchy Manager</h1>

                <Group>
                    {/* Only show Add Position if user is logged in */}
                    {user && <AddPositionModal />}

                    {!user ? (
                        <>
                            <Button
                                component={Link}
                                href="/auth/login"
                                variant="outline"
                                color="white"
                            >
                                Login
                            </Button>
                            <Button
                                component={Link}
                                href="/auth/register"
                                variant="filled"
                                color="blue"
                            >
                                Sign Up
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="outline"
                            color="red"
                            onClick={logout}
                        >
                            Logout
                        </Button>
                    )}
                </Group>
            </nav>
        </header>
    );
};

export default NavBar;
