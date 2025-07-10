import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false, // by default new user do not have account
  user: null,
  expenses: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.userData; // we are setting user details alao
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = {};
      state.expenses = [];
    },
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
    addExpense: (state, action) => {
      state.expenses.push(action.payload);
    },
    removeExpense: (state, action) => {
      state.expenses = state.expenses.filter(
        (expense) => expense.id !== action.payload
      );
    },
    editExpense: (state, action) => {
      const id = action.payload.id;
      state.expenses = state.expenses.map((expense) => {
        if (expense.id === id) {
          return {
            ...expense,
            title: action.payload.title,
            amount: action.payload.amount,
            category: action.payload.category,
            description: action.payload.description,
            date: action.payload.date,
            paymentMethod: action.payload.paymentMethod,
            location: action.payload.location,
          };
        }
        return expense;
      });
    },
  },
});

export default userSlice.reducer;

export const {
  login,
  logout,
  setExpenses,
  addExpense,
  removeExpense,
  editExpense,
} = userSlice.actions;
