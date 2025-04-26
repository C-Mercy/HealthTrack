import React, { useEffect, useState } from 'react';
import { Table, Button, message, Space } from 'antd';

const AdminPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/doctor-requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        message.error('Failed to fetch requests');
      }
    } catch (error) {
      message.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/doctor-requests/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        message.success('Request approved');
        fetchRequests();
      } else {
        message.error('Failed to approve request');
      }
    } catch (error) {
      message.error('Failed to approve request');
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/doctor-requests/${id}/reject`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        message.success('Request rejected');
        fetchRequests();
      } else {
        message.error('Failed to reject request');
      }
    } catch (error) {
      message.error('Failed to reject request');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleApprove(record.id)}>
            Approve
          </Button>
          <Button danger onClick={() => handleReject(record.id)}>
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Doctor Registration Requests</h2>
      <Table
        dataSource={requests}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default AdminPage;
