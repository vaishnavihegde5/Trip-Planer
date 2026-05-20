import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/plan');
      } else {
        setErrorMsg(data.error || 'Authentication failed');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error occurred');
    }
  };

  return (
    <div className="app-container">
      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="title">Welcome</h1>
        <p className="subtitle">Sign in to Smart Travel Planner</p>
        {errorMsg && <p style={{ color: '#ff6b6b', marginBottom: '10px' }}>{errorMsg}</p>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Your Name" 
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input 
            type="email" 
            className="input-field" 
            placeholder="Your Email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            className="input-field" 
            placeholder="Your Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn">Sign In / Register</button>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
