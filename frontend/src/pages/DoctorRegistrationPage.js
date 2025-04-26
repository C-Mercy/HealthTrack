import React, { useState } from 'react';
import { useRegisterDoctorMutation } from '../features/slices/doctorApi';

const DoctorRegistrationPage = () => {
  const [registerDoctor, { isLoading, error }] = useRegisterDoctorMutation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerDoctor(formData).unwrap();
      alert('Registration submitted. Await admin approval.');
      setFormData({
        name: '',
        email: '',
        password: '',
        specialization: '',
      });
    } catch (err) {
      console.error('Failed to register:', err);
    }
  };

  return (
    <div>
      <h2>Doctor Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Specialization:</label>
          <input name="specialization" value={formData.specialization} onChange={handleChange} required />
        </div>
        <button type="submit" disabled={isLoading}>Register</button>
        {error && <p style={{color: 'red'}}>Registration failed. Please try again.</p>}
      </form>
    </div>
  );
};

export default DoctorRegistrationPage;
