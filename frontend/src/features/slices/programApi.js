import { apiSlice } from '../../app/apiSlice';

export const programApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPrograms: builder.query({
      query: () => '/programs/getall',
      providesTags: ['Program'],
    }),
    getProgramById: builder.query({
      query: (id) => `/programs/get-program-by-Id/${id}`,
      providesTags: ['Program'],
    }),
    createProgram: builder.mutation({
      query: (programData) => ({
        url: '/programs/createProgram',
        method: 'POST',
        body: programData,
      }),
      invalidatesTags: ['Program'],
    }),
    editProgram: builder.mutation({
      query: ({ id, patch }) => ({
        url: `/programs/editProgram/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Program'],
    }),
    deleteProgram: builder.mutation({
      query: (id) => ({
        url: `/programs/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Program'],
    }),
  }),
});

export const {
  useGetProgramsQuery,
  useGetProgramByIdQuery,
  useCreateProgramMutation,
  useEditProgramMutation,
  useDeleteProgramMutation,
} = programApi;
