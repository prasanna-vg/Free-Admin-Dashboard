import { createSlice } from '@reduxjs/toolkit';

interface DashboardState {
  isSidebarOpen: boolean;
}

const initialState: DashboardState = {
  isSidebarOpen: false,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
});

export const { toggleSidebar } = dashboardSlice.actions;
export default dashboardSlice.reducer;