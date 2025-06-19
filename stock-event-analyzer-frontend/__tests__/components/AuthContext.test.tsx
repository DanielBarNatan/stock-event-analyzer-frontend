/// <reference types="jest" />

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';

// Create a simple test component that uses the AuthContext
const TestComponent = () => {
  const { user } = useAuth();
  return (
    <div>
      {user ? 'Authenticated' : 'Not authenticated'}
    </div>
  );
};

describe('AuthContext', () => {
  it('provides authentication context to child components', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // By default, user should not be authenticated
    expect(screen.getByText('Not authenticated')).toBeInTheDocument();
  });
});
