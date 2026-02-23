import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${import.meta.env.VITE_BACKEND_URL}`;

export const orderApi = createApi({
  reducerPath: "orderApi",

  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",

    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;

<<<<<<< HEAD
      // console.log("TOKEN:", token);
=======
      console.log("TOKEN:", token);
>>>>>>> 8d7bf0b0f71c57eb9a06e99423c7a209f8f1c5d7

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
