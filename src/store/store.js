import { configureStore } from "@reduxjs/toolkit"
import { loginApi } from "./Api/loginApi"
import { orderApi } from "./Api/orderApi";
import authReducer from "./slice/authSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [loginApi.reducerPath]: loginApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            loginApi.middleware,
            orderApi.middleware,
        ),
});