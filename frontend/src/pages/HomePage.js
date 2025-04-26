import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';

const HomePage = () => {
  return (
    <Container className="mt-4">
      <h1>Welcome to HealthTrack</h1>
      <div className="d-flex flex-column gap-3 mt-4">
        <Link to="/login">
          <Button variant="primary">Login</Button>
        </Link>
        <Link to="/register-doctor">
          <Button variant="secondary">Register as Doctor</Button>
        </Link>
        <Link to="/clients">
          <Button variant="success">Clients</Button>
        </Link>
        <Link to="/programs">
          <Button variant="info">Programs</Button>
        </Link>
      </div>
    </Container>
  );
};

export default HomePage;
