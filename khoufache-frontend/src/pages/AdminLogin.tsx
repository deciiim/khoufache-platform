import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import './AdminLogin.css';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Send login request to backend
      const res = await axios.post('http://localhost:3000/auth/login', credentials);
      
      // 2. Save the token in LocalStorage
      localStorage.setItem('adminToken', res.data.access_token);
      
      // 3. Redirect to the Dashboard
      navigate('/admin');
    } catch (err) {
      setError('خطأ في اسم المستخدم أو كلمة المرور');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="bat-logo">🦇</div>
          <h2>Batcave Access</h2>
          <p>أدخل بيانات المسؤول للمتابعة</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <User size={20} className="input-icon" />
            <input 
              type="text" 
              placeholder="اسم المستخدم" 
              required
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
          </div>

          <div className="input-group">
            <Lock size={20} className="input-icon" />
            <input 
              type="password" 
              placeholder="كلمة المرور" 
              required
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="login-btn">تسجيل الدخول</button>
        </form>
      </div>
    </div>
  );
}