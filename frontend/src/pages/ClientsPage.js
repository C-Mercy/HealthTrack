import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, Space, Modal, Form, Input, message, Select } from 'antd';
import { useGetClientsQuery, useDeleteClientMutation, useEditClientMutation, useRegisterClientMutation } from '../features/slices/clientApi';
import { useGetProgramsQuery } from '../features/slices/programApi';

const { Option } = Select;

const ClientsPage = () => {
  const { data: clients, error, isLoading } = useGetClientsQuery();
  const { data: programs } = useGetProgramsQuery();
  const [deleteClient] = useDeleteClientMutation();
  const [updateClient] = useEditClientMutation();
  const [addClient] = useRegisterClientMutation();

  const [isViewModalVisible, setViewModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();

  const showViewModal = (client) => {
    setSelectedClient(client);
    setViewModalVisible(true);
  };

  const showEditModal = (client) => {
    setSelectedClient(client);
    editForm.setFieldsValue({
      ...client,
      programIds: client.programs ? client.programs.map(p => p.id) : [],
    });
    setEditModalVisible(true);
  };

  const showAddModal = () => {
    addForm.resetFields();
    setAddModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteClient(id).unwrap();
      message.success('Client deleted successfully');
    } catch {
      message.error('Failed to delete client');
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      await updateClient({ id: selectedClient.id, ...values, age: Number(values.age) }).unwrap();
      message.success('Client updated successfully');
      setEditModalVisible(false);
    } catch {
      message.error('Failed to update client');
    }
  };

  const handleAddSubmit = async (values) => {
    try {
      await addClient({ ...values, age: Number(values.age) }).unwrap();
      message.success('Client added successfully');
      setAddModalVisible(false);
    } catch {
      message.error('Failed to add client');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterSearch: true,
      onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      filters: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
      ],
      onFilter: (value, record) => record.gender.toLowerCase() === value,
    },
    {
      title: 'Programs',
      dataIndex: 'programs',
      key: 'programs',
      render: (programs) => programs.map(p => p.name).join(', '),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => showViewModal(record)}>View</Button>
          <Button type="default" onClick={() => showEditModal(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this client?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading clients</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Clients</h2>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={showAddModal}>
        Add Client
      </Button>
      <Table
        dataSource={clients}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="View Client"
        visible={isViewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
      >
        {selectedClient && (
          <div>
            <p><strong>ID:</strong> {selectedClient.id}</p>
            <p><strong>Name:</strong> {selectedClient.name}</p>
            <p><strong>Age:</strong> {selectedClient.age}</p>
            <p><strong>Gender:</strong> {selectedClient.gender}</p>
            <p><strong>Programs:</strong> {selectedClient.programs.map(p => p.name).join(', ')}</p>
          </div>
        )}
      </Modal>

      <Modal
        title="Edit Client"
        visible={isEditModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter client name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="Age"
            rules={[{ required: true, message: 'Please enter client age' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please enter client gender' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="programIds"
            label="Programs"
          >
            <Select
              mode="multiple"
              placeholder="Select programs"
              allowClear
            >
              {programs && programs.map(program => (
                <Option key={program.id} value={program.id}>{program.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Client"
        visible={isAddModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter client name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="Age"
            rules={[{ required: true, message: 'Please enter client age' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please enter client gender' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="programIds"
            label="Programs"
          >
            <Select
              mode="multiple"
              placeholder="Select programs"
              allowClear
            >
              {programs && programs.map(program => (
                <Option key={program.id} value={program.id}>{program.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Client
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientsPage;
