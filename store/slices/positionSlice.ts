// store/positionSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Position } from "@/types/position";
import {getPositions, createPosition, updatePosition, deletePosition, getPositionById} from "@/lib/api";

interface PositionState {
    positions: Position[];
    loading: boolean;
    error: string | null;
}

const initialState: PositionState = {
    positions: [],
    loading: false,
    error: null,
};


export const fetchPositions = createAsyncThunk("positions/fetch", async () => {
    const response = await getPositions();
    return response.data;
});

export const fetchPositionById = createAsyncThunk("positions/fetchById",
    async (id: number) => {
    const response = await getPositionById(id);
    return response.data;
});

export const addPosition = createAsyncThunk(
    "positions/add",
    async (data: Omit<Position, "id">) => {
        const response = await createPosition(data);
        return response.data;
    }
);

export const editPosition = createAsyncThunk(
    "positions/edit",
    async ({ id, data }: { id: number; data: Partial<Position> }) => {
        const response = await updatePosition(id, data);
        return response.data;
    }
);

export const removePosition = createAsyncThunk("positions/remove", async (id: number) => {
    await deletePosition(id);
    return id;
});

// Slice
const positionSlice = createSlice({
    name: "positions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPositions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchPositions.fulfilled, (state, action: PayloadAction<Position[]>) => {
                state.positions = action.payload;
                state.loading = false;
            })
            .addCase(fetchPositions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch positions";
            })
            .addCase(fetchPositionById.pending, (state) => {
                state.loading = true;
                state.error = null

            })
            .addCase(fetchPositionById.fulfilled, (state, action: PayloadAction<Position>) => {
                const index = state.positions.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.positions[index] = action.payload;
                } else {
                    state.positions.push(action.payload);
                }
                state.loading = false;
            })
            .addCase(fetchPositionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch position"

            })
            .addCase(addPosition.fulfilled, (state, action: PayloadAction<Position>) => {
                state.positions.push(action.payload);
            })

            .addCase(editPosition.fulfilled, (state, action: PayloadAction<Position>) => {
                const index = state.positions.findIndex((p) => p.id === action.payload.id);
                if (index !== -1) state.positions[index] = action.payload;
            })
            .addCase(removePosition.fulfilled, (state, action: PayloadAction<number>) => {
                state.positions = state.positions.filter((p) => p.id !== action.payload);
            });
    },
});

export default positionSlice.reducer;
