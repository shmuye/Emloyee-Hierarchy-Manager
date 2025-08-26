import {configureStore} from "@reduxjs/toolkit";
import PositionReducer from "./slices/positionSlice";

export const store = configureStore({
    reducer: {
        positions: PositionReducer,
    },
    })
;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch