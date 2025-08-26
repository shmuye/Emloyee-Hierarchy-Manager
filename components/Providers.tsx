"use client";

import { Provider } from "react-redux";
import { MantineProvider } from "@mantine/core";
import { store } from "@/store";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <MantineProvider>{children}</MantineProvider>
        </Provider>
    );
}
