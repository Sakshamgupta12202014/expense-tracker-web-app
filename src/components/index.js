import { login, logout, setExpenses, addExpense, removeExpense, editExpense } from "../store/userSlice"
import authService from "../services/authService"
import store from "../store/store"

export default {authService, store,login, logout, setExpenses, addExpense, removeExpense, editExpense };