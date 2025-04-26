import { apiSlice } from "../../app/apiSlice";

export const doctorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerDoctor: builder.mutation({
      query: (doctorData) => ({
        url: '/doctors/register',
        method: 'POST',
        body: doctorData,
      }),
      invalidatesTags: ['Doctor'],
    }),
    loginDoctor: builder.mutation({
      query: (credentials) => ({
        url: '/doctors/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getDoctors: builder.query({
      query: () => '/doctors',
      providesTags: ['Doctor'],
    }),
    approveDoctor: builder.mutation({
      query: (id) => ({
        url: `/doctors/approve/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Doctor'],
    }),
  }),
});

export const {
  useRegisterDoctorMutation,
  useLoginDoctorMutation,
  useGetDoctorsQuery,
  useApproveDoctorMutation,
} = doctorApi;
