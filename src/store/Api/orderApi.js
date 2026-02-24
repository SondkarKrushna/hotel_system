import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${import.meta.env.VITE_BACKEND_URL}`;

export const orderApi = createApi({
  reducerPath: "orderApi",

  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",

    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;

      console.log("TOKEN:", token);

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["Orders"],

  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/api/orders?page=${page}&limit=${limit}`,
      providesTags: ["Orders"],
    }),
  }),
});

export const { useGetOrdersQuery } = orderApi;
