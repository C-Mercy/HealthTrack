import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { useGetProgramsQuery, useDeleteProgramMutation } from '../features/slices/programApi';

const ProgramsPage = () => {
  const { data: programs, error, isLoading } = useGetProgramsQuery();
  const [deleteProgram] = useDeleteProgramMutation();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      await deleteProgram(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading programs</div>;

  return (
    <div>
      <h2>Programs</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {programs && programs.map(program => (
            <tr key={program.id}>
              <td>{program.id}</td>
              <td>{program.name}</td>
              <td>
                <Button variant="primary" size="sm" onClick={() => alert('View program ' + program.id)}>View</Button>{' '}
                <Button variant="warning" size="sm" onClick={() => alert('Edit program ' + program.id)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(program.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Pagination can be added here */}
    </div>
  );
};

export default ProgramsPage;
