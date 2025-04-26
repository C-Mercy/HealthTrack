import React, { useState } from 'react';
import { Form, Input, Button, Card, Alert, Typography, Space, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLoginDoctorMutation } from '../features/slices/doctorApi';

const { Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginDoctor, { isLoading }] = useLoginDoctorMutation();
  const [loginError, setLoginError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoginError(null);
    try {
      const user = await loginDoctor(values).unwrap();
      if (user && user.token) {
        localStorage.setItem('token', user.token);
      }
      navigate('/home');
    } catch (err) {
      setLoginError('Login failed. Please check your credentials.');
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleRequestRegistration = async (values) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/doctor-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        message.success('Registration request submitted successfully');
        setIsModalVisible(false);
        form.resetFields();
      } else {
        const data = await response.json();
        message.error(data.message || 'Failed to submit registration request');
      }
    } catch (error) {
      message.error('Failed to submit registration request');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Card title="Doctor Login" style={{ width: 350 }}>
        {loginError && <Alert message={loginError} type="error" showIcon style={{ marginBottom: 16 }} />}
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ email: '', password: '' }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" htmlType="submit" loading={isLoading} block>
                Login
              </Button>
              <Button type="default" onClick={showModal} block>
                Request Registration
              </Button>
            </Space>
          </Form.Item>
        </Form>
        <Text>
          If you want an account, please request to be added as a doctor. Only admins can create accounts.
        </Text>
      </Card>

      <Modal
        title="Doctor Registration Request"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleRequestRegistration}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter a password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit Request
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LoginPage;
