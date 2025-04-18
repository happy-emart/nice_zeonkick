import React from 'react';
import { useAuth } from './context/AuthContext'; // Adjust path as needed
import LoginForm from './components/LoginForm';   // Adjust path as needed
import SignupForm from './components/SignupForm';  // Adjust path as needed
import './App.css'; // Import basic styles

function App() {
  const { currentUser, logout } = useAuth();
  const [error, setError] = React.useState('');

  const handleLogout = async () => {
    setError('');
    try {
      await logout();
      console.log('Logout successful');
    } catch (err) {
      setError('Failed to log out');
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="App">
      <h1>Firebase Auth App</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {currentUser ? (
        <div className="loggedInView">
          <h2>Welcome!</h2>
          <p>Email: {currentUser.email}</p>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <div className="loggedOutView">
          <LoginForm />
          <hr /> {/* Separator */}
          <SignupForm />
        </div>
      )}
    </div>
  );
}

export default App;
