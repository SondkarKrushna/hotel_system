import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://hotelmanagement-vcsy.onrender.com/api/",
  }),
  tagTypes: ["Category"],

  endpoints: (builder) => ({
    // 🔹 GET All Categories
    getCategories: builder.query({
      query: () => "category",
      providesTags: ["Category"],
    }),

    // 🔹 CREATE Category
    createCategory: builder.mutation({
      query: (body) => ({
        url: "category",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    // 🔹 UPDATE Category
    updateCategory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `category/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    // 🔹 DELETE Category
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;