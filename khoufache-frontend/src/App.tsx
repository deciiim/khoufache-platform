import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Home from './pages/Home';
import Withdraw from './pages/Withdraw';
import Recharge from './pages/Recharge';
import Contact from './pages/Contact';
import VideoExplain from './pages/VideoExplain';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './pages/AdminLogin'; 
import './App.css';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    // No token? Send them to the login page
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        
        {/* --- BACKGROUND ANIMATIONS --- */}
        <div className="moon"></div>
        
        <div className="bat-bg">
          <div className="bat"></div>
          <div className="bat"></div>
          <div className="bat"></div>
          <div className="bat"></div>
          <div className="bat"></div>
        </div>

        <Navbar /> 
        
        <div className="page-content relative z-10">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/recharge" element={<Recharge />} /> 
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/video" element={<VideoExplain />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Login Route */}
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* SECURED Admin Route */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Fallback for undefined routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}