import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/admin' }),
  endpoints: (builder) => ({
    getDashboardCounts: builder.query({
      query: () => 'dashboard-counts',
    }),
    getDoctorRequests: builder.query({
      query: () => 'doctor-requests',
    }),
    approveDoctorRequest: builder.mutation({
      query: (id) => ({
        url: `doctor-requests/${id}/approve`,
        method: 'PUT',
      }),
    }),
    rejectDoctorRequest: builder.mutation({
      query: (id) => ({
        url: `doctor-requests/${id}/reject`,
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  useGetDashboardCountsQuery,
  useGetDoctorRequestsQuery,
  useApproveDoctorRequestMutation,
  useRejectDoctorRequestMutation,
} = adminApi;
