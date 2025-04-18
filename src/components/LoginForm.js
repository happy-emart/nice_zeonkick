import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust path as needed

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Get login function from context

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and limit to 8 digits
    if (/^\d*$/.test(value) && value.length <= 8) {
      setPassword(value);
      setError('');
    } else if (value.length > 8) {
      setError('Password cannot exceed 8 digits.');
    } else if (value !== '' && !/^\d*$/.test(value)) {
      setError('Password must contain only numbers.');
    } else {
       setPassword(value); // Allow clearing the field
       setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

     // Add validation check before submitting
    if (error) {
        console.log("Preventing submission due to validation error:", error);
        return;
    }
    if (!password) {
        setError('Password is required.');
        return;
    }
    if (!/^\d{1,8}$/.test(password)) {
        setError('Password must be numeric and up to 8 digits.');
        return;
    }

    try {
      setError(''); // Clear previous errors before attempting login
      setLoading(true);
      await login(email, password);
      // Login successful - handled by AuthContext listener
      // You might want to redirect here or in the App component
       console.log('Login successful');
    } catch (err) {
      // Check if the error is due to Firebase password requirements (example)
      if (err.code === 'auth/weak-password') {
        setError('Firebase rejected the password. It might be too weak even if numeric and 8 digits.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') { // Handle common login errors
         setError('Invalid email or password.');
      } else {
        setError(err.message || 'Failed to log in');
      }
       console.error("Login error:", err.code, err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {/* Display general errors first */}
      {error && !error.includes('Password must be') && !error.includes('Password cannot exceed') && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="login-email">Email:</label>
        <input
          type="email"
          id="login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="login-password">Password (Numbers, max 8 digits):</label>
        <input
          type="password" // Keep type="password" for masking
          id="login-password"
          value={password}
          // onChange={(e) => setPassword(e.target.value)}
          onChange={handlePasswordChange}
          maxLength={8} // HTML5 attribute
          inputMode="numeric" // Hint for mobile keyboards
          pattern="\d*"      // HTML5 pattern validation
          required
        />
        {/* Display password-specific errors inline */}
        {error && (error.includes('Password must be') || error.includes('Password cannot exceed')) && <p style={{ color: 'red', marginTop: '5px' }}>{error}</p>}
      </div>
      <button type="submit" disabled={loading}>
         {loading ? 'Logging In...' : 'Login'}
      </button>
    </form>
  );
}

export default LoginForm; 