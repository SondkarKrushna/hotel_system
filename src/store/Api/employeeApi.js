import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const employeeApi = createApi({
    reducerPath: "employeeApi",

    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}`,
        prepareHeaders: (headers, { getState }) => {
            // If you are using auth token
            const token = getState()?.auth?.token;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),

    tagTypes: ["Employee"],

    endpoints: (builder) => ({

        // ✅ GET ALL EMPLOYEES
        getEmployees: builder.query({
            query: (hotelId) => ({
                url: `/api/staff`,
                params: { hotelId },
            }),
            providesTags: ["Employee"],
        }),

        // ✅ GET SINGLE EMPLOYEE (optional)
        getEmployeeById: builder.query({
            query: (id) => `/api/staff/${id}`,
            providesTags: ["Employee"],
        }),

        // ✅ CREATE EMPLOYEE
        createEmployee: builder.mutation({
            query: (body) => ({
                url: "/api/staff",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Employee"],
        }),

        // ✅ UPDATE EMPLOYEE
        updateEmployee: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/api/staff/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Employee"],
        }),

        // ✅ DELETE EMPLOYEE
        deleteEmployee: builder.mutation({
            query: (id) => ({
                url: `/api/staff/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Employee"],
        }),
    }),
});

export const {
    useGetEmployeesQuery,
    useGetEmployeeByIdQuery,
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
} = employeeApi;