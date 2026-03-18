import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Menu, Category } from '../../types';

interface MenusState {
  list: Menu[];
  categories: Category[];
  selectedCategory: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: MenusState = {
  list: [],
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
};

const menusSlice = createSlice({
  name: 'menus',
  initialState,
  reducers: {
    setMenus(state, action: PayloadAction<Menu[]>) {
      state.list = action.payload;
    },
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<number | null>) {
      state.selectedCategory = action.payload;
    },
    addMenu(state, action: PayloadAction<Menu>) {
      state.list.push(action.payload);
    },
    updateMenu(state, action: PayloadAction<Menu>) {
      const idx = state.list.findIndex((m) => m.id === action.payload.id);
      if (idx !== -1) state.list[idx] = action.payload;
    },
    removeMenu(state, action: PayloadAction<number>) {
      state.list = state.list.filter((m) => m.id !== action.payload);
    },
    reorderMenus(state, action: PayloadAction<Menu[]>) {
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

export const {
  setMenus,
  setCategories,
  setSelectedCategory,
  addMenu,
  updateMenu,
  removeMenu,
  reorderMenus,
  setLoading,
  setError,
} = menusSlice.actions;
export default menusSlice.reducer;
