import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Badge, Button, Modal, Form, Input, message } from 'antd';
import { UserOutlined, ProfileOutlined, PlusOutlined } from '@ant-design/icons';
import { useGetClientsQuery,useRegisterClientMutation} from '../features/slices/clientApi';
import { useGetProgramsQuery,useCreateProgramMutation} from '../features/slices/programApi';



const { Meta } = Card;

const HomePage = () => {
  const navigate = useNavigate();
  const { data: clients } = useGetClientsQuery();
  const { data: programs } = useGetProgramsQuery();

  const [addClient] = useRegisterClientMutation();
  const [addProgram] = useCreateProgramMutation();

  const [isClientModalVisible, setClientModalVisible] = useState(false);
  const [isProgramModalVisible, setProgramModalVisible] = useState(false);

  const [clientForm] = Form.useForm();
  const [programForm] = Form.useForm();

  const clientCount = clients ? clients.length : 0;
  const programCount = programs ? programs.length : 0;

  const cardStyle = {
    cursor: 'pointer',
    borderRadius: 8,
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  };

  const showClientModal = () => {
    clientForm.resetFields();
    setClientModalVisible(true);
  };

  const showProgramModal = () => {
    programForm.resetFields();
    setProgramModalVisible(true);
  };

  const handleClientAdd = async (values) => {
    try {
      await addClient(values).unwrap();
      message.success('Client added successfully');
      setClientModalVisible(false);
    } catch (error) {
      message.error('Failed to add client');
    }
  };

  const handleProgramAdd = async (values) => {
    try {
      await addProgram(values).unwrap();
      message.success('Program added successfully');
      setProgramModalVisible(false);
    } catch (error) {
      message.error('Failed to add program');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Welcome to HealthTrack</h1>
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12}>
          <Card
            hoverable
            style={{ ...cardStyle, backgroundColor: '#bae7ff' }}
            onClick={() => navigate('/clients')}
            cover={
              <div style={{ fontSize: 48, color: '#1890ff', textAlign: 'center', paddingTop: 24 }}>
                <UserOutlined />
              </div>
            }
            actions={[
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  showClientModal();
                }}
                key="add-client"
              >
                Add Client
              </Button>,
            ]}
          >
            <Meta
              title="Clients"
              description={
                <Badge count={clientCount} showZero style={{ backgroundColor: '#1890ff' }} />
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card
            hoverable
            style={{ ...cardStyle, backgroundColor: '#ffd591' }}
            onClick={() => navigate('/programs')}
            cover={
              <div style={{ fontSize: 48, color: '#faad14', textAlign: 'center', paddingTop: 24 }}>
                <ProfileOutlined />
              </div>
            }
            actions={[
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  showProgramModal();
                }}
                key="add-program"
              >
                Add Program
              </Button>,
            ]}
          >
            <Meta
              title="Programs"
              description={
                <Badge count={programCount} showZero style={{ backgroundColor: '#faad14' }} />
              }
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Add Client"
        visible={isClientModalVisible}
        onCancel={() => setClientModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={clientForm} layout="vertical" onFinish={handleClientAdd}>
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
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Client
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Program"
        visible={isProgramModalVisible}
        onCancel={() => setProgramModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={programForm} layout="vertical" onFinish={handleProgramAdd}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter program name' }]}
          >
            <Input />
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

export default HomePage;
