import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TableStatus } from '../../types';

interface TablesState {
  list: TableStatus[];
  loading: boolean;
  error: string | null;
}

const initialState: TablesState = {
  list: [],
  loading: false,
  error: null,
};

const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    setTables(state, action: PayloadAction<TableStatus[]>) {
      state.list = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setTables, setLoading, setError } = tablesSlice.actions;
export default tablesSlice.reducer;
