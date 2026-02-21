import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dishApi = createApi({
  reducerPath: "dishApi",
  baseQuery: fetchBaseQuery({
     baseUrl: `${import.meta.env.VITE_BACKEND_URL}`

  }),
  tagTypes: ["Dish"],
  endpoints: (builder) => ({
    getDishes: builder.query({
      query: () => "/api/dish",
      providesTags: ["Dish"],
    }),

    createDish: builder.mutation({
      query: (body) => ({
        url: "/api/dish",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Dish"],
    }),

    updateDish: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/dish/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Dish"],
    }),

    deleteDish: builder.mutation({
      query: (id) => ({
        url: `/api/dish/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Dish"],
    }),
  }),
});

export const {
  useGetDishesQuery,
  useCreateDishMutation,
  useUpdateDishMutation,
  useDeleteDishMutation,
} = dishApi;