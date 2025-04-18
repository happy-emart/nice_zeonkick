import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust path as needed

function SignupForm() {
  // const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth(); // Get signup function from context

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
     // Ensure password meets the 8-digit numeric format exactly on submit
    if (!/^\d{1,8}$/.test(password)) { 
        setError('Password must be numeric and up to 8 digits.');
        return;
    }

    setError(''); // Clear previous errors before attempting signup
    setLoading(true);

    try {
      // await signup(name, password);
      await signup(email, password);
      // Signup successful - handled by AuthContext listener
      // You might want to redirect here or in the App component
      console.log('Signup successful');
    } catch (err) {
        // Firebase provides specific error codes, you could customize messages
        // e.g., if (err.code === 'auth/email-already-in-use') { ... }
        if (err.code === 'auth/weak-password') {
          setError('Firebase rejected the password. It must be at least 6 characters long (even if numeric).');
        } else if (err.code === 'auth/email-already-in-use') {
           setError('This email address is already registered.');
        } else if (err.code === 'auth/invalid-email') {
            setError('Please enter a valid email address.');
        } else {
          setError(err.message || 'Failed to create an account');
        }
       console.error("Signup error:", err.code, err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      {/* Display general errors first */}
      {error && !error.includes('Password must be') && !error.includes('Password cannot exceed') && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="signup-email">Email:</label>
        <input
          type="email"
          id="signup-email"
          // value={name}
          // onChange={(e) => setName(e.target.value)}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="signup-password">Password (Numbers, max 8 digits):</label>
        <input
          type="password"
          id="signup-password"
          value={password}
          // onChange={(e) => setPassword(e.target.value)}
          onChange={handlePasswordChange}
          // required
          // minLength={6} // Remove Firebase default length, enforce custom rules
          maxLength={8} // HTML5 attribute
          inputMode="numeric" // Hint for mobile keyboards
          pattern="\d*"      // HTML5 pattern validation
          required // Keep required
        />
         {/* Display password-specific errors inline */}
         {error && (error.includes('Password must be') || error.includes('Password cannot exceed')) && <p style={{ color: 'red', marginTop: '5px' }}>{error}</p>}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>
    </form>
  );
}

export default SignupForm; 