import { configureStore } from "@reduxjs/toolkit"
import { loginApi } from "./Api/loginApi"
import { orderApi } from "./Api/orderApi";
import authReducer from "./slice/authSlice"
<<<<<<< HEAD
import { hotelApi } from "./Api/hotelApi";
import { dishApi } from "./Api/dishApi";
import { categoryApi } from "./Api/categoryApi";
import { employeeApi } from "./Api/employeeApi";
=======
>>>>>>> 8d7bf0b0f71c57eb9a06e99423c7a209f8f1c5d7

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [loginApi.reducerPath]: loginApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
<<<<<<< HEAD
        [hotelApi.reducerPath]: hotelApi.reducer,
        [dishApi.reducerPath]: dishApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [employeeApi.reducerPath]: employeeApi.reducer,
=======
>>>>>>> 8d7bf0b0f71c57eb9a06e99423c7a209f8f1c5d7
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            loginApi.middleware,
            orderApi.middleware,
<<<<<<< HEAD
            hotelApi.middleware,
            dishApi.middleware,
            categoryApi.middleware,
            employeeApi.middleware,
=======
>>>>>>> 8d7bf0b0f71c57eb9a06e99423c7a209f8f1c5d7
        ),
});