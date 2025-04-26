import React, { useState } from 'react';
import { useLoginDoctorMutation } from '../features/slices/doctorApi';

const LoginPage = () => {
  const [loginDoctor, { isLoading, error }] = useLoginDoctorMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginDoctor({ email, password }).unwrap();
      // Handle successful login, e.g., save token, redirect
      console.log('Login successful:', user);
    } catch (err) {
      console.error('Failed to login:', err);
    }
  };

  return (
    <div>
      <h2>Doctor Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>Login</button>
        {error && <p style={{color: 'red'}}>Login failed. Please check your credentials.</p>}
      </form>
    </div>
  );
};

export default LoginPage;
