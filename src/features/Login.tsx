import React, { useState } from 'react';
import { Form } from '../components/Form';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';
import { UserIcon } from 'hugeicons-react';

export const Login: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Get form data
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    
    console.log('Login submitted:', { username, password });
    
    // Simulate login process
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Login successful! (This is just a demo)');
    }, 1000);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#1c1c1c', color: '#e5e7eb', minHeight: '200px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <UserIcon size={24} color="#e5e7eb" style={{ marginRight: '12px' }} />
        <h2 style={{ margin: '0', color: '#e5e7eb' }}>Login</h2>
      </div>


        <Button type="submit" variant="primary" isDisabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>

    </div>
  );
};