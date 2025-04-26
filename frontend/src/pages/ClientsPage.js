import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { useGetClientsQuery, useDeleteClientMutation } from '../features/slices/clientApi';

const ClientsPage = () => {
  const { data: clients, error, isLoading } = useGetClientsQuery();
  const [deleteClient] = useDeleteClientMutation();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      await deleteClient(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading clients</div>;

  return (
    <div>
      <h2>Clients</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients && clients.map(client => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.name}</td>
              <td>{client.age}</td>
              <td>{client.gender}</td>
              <td>
                <Button variant="primary" size="sm" onClick={() => alert('View client ' + client.id)}>View</Button>{' '}
                <Button variant="warning" size="sm" onClick={() => alert('Edit client ' + client.id)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(client.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Pagination can be added here */}
    </div>
  );
};

export default ClientsPage;
