import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const hotelApi = createApi({
  reducerPath: "hotelApi",
   baseQuery: fetchBaseQuery({
    baseUrl: `/api/hotels`,
    credentials: "include",
  }),
  tagTypes: ["Hotels"],
  endpoints: (builder) => ({
    getHotels: builder.query({
      query: () => `/hotels`,
      providesTags: ["Hotels"],
    }),

    addHotel: builder.mutation({
      query: (body) => ({
        url: "/hotels",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Hotels"],
    }),

    updateHotel: builder.mutation({
      query: ({ id, body }) => ({
        url: `/hotels/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Hotels"],
    }),

    deleteHotel: builder.mutation({
      query: (id) => ({
        url: `/hotels/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hotels"],
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useAddHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
} = hotelApi;
