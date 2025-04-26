import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, Spin } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setLoading(true);
        try {
          const baseQuery = fetchBaseQuery({ baseUrl: 'http://localhost:5000/api' });
          const result = await baseQuery(
            { url: '/doctors/profile', headers: { Authorization: `Bearer ${token}` } },
            {},
            {}
          );
          if (result.data) {
            setDoctor(result.data);
          } else {
            setDoctor(null);
          }
        } catch (error) {
          console.error('Failed to fetch doctor profile', error);
          setDoctor(null);
        } finally {
          setLoading(false);
        }
      } else {
        setDoctor(null);
      }
    };
    fetchDoctorProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (location.pathname === '/login') {
    return null; 
  }

  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <span>{doctor ? doctor.name : 'Profile'}</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="logo" style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
        <Link to="/home" style={{ color: 'white' }}>HealthTrack</Link>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectable={false}
        style={{ flex: 1, marginLeft: 20 }}
      >
        <Menu.Item key="clients">
          <Link to="/clients">Clients</Link>
        </Menu.Item>
        <Menu.Item key="programs">
          <Link to="/programs">Programs</Link>
        </Menu.Item>
      </Menu>
      <div>
        {loading ? (
          <Spin style={{ color: 'white' }} />
        ) : (
          <Dropdown overlay={menu} placement="bottomRight" arrow>
            <Avatar style={{ backgroundColor: '#87d068', cursor: 'pointer' }} icon={<UserOutlined />} />
          </Dropdown>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;
