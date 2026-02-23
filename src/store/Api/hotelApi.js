import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const hotelApi = createApi({
  reducerPath: "hotelApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL || "https://hotelmanagement-vcsy.onrender.com",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  tagTypes: ["Hotels"],

  endpoints: (builder) => ({
    getHotels: builder.query({
      query: () => `/api/hotels`,
      providesTags: ["Hotels"],
    }),
    // ✅ NEW
    getHotelById: builder.query({
      query: (id) => `/api/hotels/${id}`,
      providesTags: ["Hotels"],
    }),

    addHotel: builder.mutation({
      query: (body) => ({
        url: "/api/hotels",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Hotels"],
    }),

    updateHotel: builder.mutation({
      query: ({ id, body }) => ({
        url: `/api/hotels/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Hotels"],
    }),
    updateHotelStatus: builder.mutation({
  query: ({ id, status }) => ({
    url: `/api/hotels/${id}/approve`,
    method: "PATCH",
    body: { status },
  }),
}),

    deleteHotel: builder.mutation({
      query: (id) => ({
        url: `/api/hotels/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hotels"],
    }),
  }),
});

// ✅ ADD THIS PART (IMPORTANT)
export const {
  useGetHotelsQuery,
  useGetHotelByIdQuery,
  useAddHotelMutation,
  useUpdateHotelMutation,
  useUpdateHotelStatusMutation,
  useDeleteHotelMutation,
} = hotelApi;