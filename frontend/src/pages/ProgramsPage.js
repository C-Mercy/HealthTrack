import React, { useState } from 'react';
import { Table, Button, Popconfirm, Space, Modal, Form, Input, message, Select } from 'antd';
import { useGetProgramsQuery, useDeleteProgramMutation, useEditProgramMutation, useCreateProgramMutation  } from '../features/slices/programApi';
import { useGetClientsQuery } from '../features/slices/clientApi';


const { Option } = Select;

const ProgramsPage = () => {
  const { data: programs, error, isLoading } = useGetProgramsQuery();
  const { data: clients } = useGetClientsQuery();
  const [deleteProgram] = useDeleteProgramMutation();
  const [updateProgram] = useEditProgramMutation();
  const [addProgram] = useCreateProgramMutation();

  const [isViewModalVisible, setViewModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();

  const showViewModal = (program) => {
    setSelectedProgram(program);
    setViewModalVisible(true);
  };

  const showEditModal = (program) => {
    setSelectedProgram(program);
    editForm.setFieldsValue({
      ...program,
      clientIds: program.clients ? program.clients.map(c => c.id) : [],
    });
    setEditModalVisible(true);
  };

  const showAddModal = () => {
    addForm.resetFields();
    setAddModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProgram(id).unwrap();
      message.success('Program deleted successfully');
    } catch {
      message.error('Failed to delete program');
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      await updateProgram({ id: selectedProgram.id, ...values }).unwrap();
      message.success('Program updated successfully');
      setEditModalVisible(false);
    } catch {
      message.error('Failed to update program');
    }
  };

  const handleAddSubmit = async (values) => {
    try {
      await addProgram(values).unwrap();
      message.success('Program added successfully');
      setAddModalVisible(false);
    } catch {
      message.error('Failed to add program');
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
      title: 'Clients',
      dataIndex: 'clients',
      key: 'clients',
      render: (clients) => clients.map(c => c.name).join(', '),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => showViewModal(record)}>View</Button>
          <Button type="default" onClick={() => showEditModal(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this program?"
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
  if (error) return <div>Error loading programs</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Programs</h2>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={showAddModal}>
        Add Program
      </Button>
      <Table
        dataSource={programs}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="View Program"
        visible={isViewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
      >
        {selectedProgram && (
          <div>
            <p><strong>ID:</strong> {selectedProgram.id}</p>
            <p><strong>Name:</strong> {selectedProgram.name}</p>
            <p><strong>Clients:</strong> {selectedProgram.clients.map(c => c.name).join(', ')}</p>
          </div>
        )}
      </Modal>

      <Modal
        title="Edit Program"
        visible={isEditModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter program name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="clientIds"
            label="Clients"
          >
            <Select
              mode="multiple"
              placeholder="Select clients"
              allowClear
            >
              {clients && clients.map(client => (
                <Option key={client.id} value={client.id}>{client.name}</Option>
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
        title="Add Program"
        visible={isAddModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddSubmit}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter program name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="clientIds"
            label="Clients"
          >
            <Select
              mode="multiple"
              placeholder="Select clients"
              allowClear
            >
              {clients && clients.map(client => (
                <Option key={client.id} value={client.id}>{client.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Program
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProgramsPage;
