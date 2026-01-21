import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldAlert } from 'lucide-react';
import './AdminLogin.css';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Use the environment variable for the API URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // 1. Send login request to backend
      const res = await axios.post(`${API_URL}/auth/login`, credentials);
      
      // 2. Save the token in LocalStorage
      localStorage.setItem('adminToken', res.data.access_token);
      
      // 3. Redirect to the Dashboard
      navigate('/admin');
    } catch (err: any) {
      console.error("Login Error:", err);
      if (err.response?.status === 401) {
        setError('خطأ في اسم المستخدم أو كلمة المرور');
      } else {
        setError('تعذر الاتصال بالخادم. يرجى المحاولة لاحقاً');
      }
    } finally {
      setLoading(false);
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
              disabled={loading}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
          </div>

          <div className="input-group">
            <Lock size={20} className="input-icon" />
            <input 
              type="password" 
              placeholder="كلمة المرور" 
              required
              disabled={loading}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>

          {error && (
            <div className="error-msg">
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            className={`login-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}