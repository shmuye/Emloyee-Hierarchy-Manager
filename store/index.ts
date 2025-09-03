import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import positionReducer from "./slices/positionSlice";

export const store = configureStore({
    reducer: {
        positions: positionReducer,
        auth: authReducer
    },
    })
;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch