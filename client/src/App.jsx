import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import './index.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const setAuth = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <div className="app-container">
      {!token ? (
        <Login setAuth={setAuth} />
      ) : (
        <Dashboard token={token} logout={logout} />
      )}
    </div>
  );
};

export default App;
