import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { Check, X, RefreshCw, Trash2, Search, ExternalLink, MessageCircle, LogOut } from 'lucide-react';
import './AdminDashboard.css';

interface Transaction {
  id: number;
  platform: string;
  operationType: string;
  playerId: string;
  amount: number;
  proofScreenshot?: string;
  status: string;
  createdAt: string;
  withdrawMethod?: string;
  bank?: string;
  fullName?: string;
  rib?: string;
  phone?: string;
  code?: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  // Helper to get token and set headers
  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Polling every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:3000/transactions', getAuthHeader());
      setOrders(res.data.sort((a: any, b: any) => b.id - a.id));
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      // If unauthorized, kick back to login
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    if (!window.confirm(`هل أنت متأكد من تغيير الحالة إلى ${newStatus}؟`)) return;
    try {
      await axios.patch(`http://localhost:3000/transactions/${id}`, { status: newStatus }, getAuthHeader());
      fetchOrders();
    } catch (err) {
      alert('Error updating status - Session may have expired');
    }
  };

  const deleteOrder = async (id: number) => {
    if (!window.confirm('⚠️ هل أنت متأكد من حذف هذا الطلب نهائياً؟')) return;
    try {
      await axios.delete(`http://localhost:3000/transactions/${id}`, getAuthHeader());
      setOrders(orders.filter(o => o.id !== id));
    } catch (err) {
      alert('Error deleting order');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const openWhatsApp = (phone: string, id: number) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(`السلام عليكم، بخصوص طلبكم رقم #${id} على منصة Khoufache:`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'ALL') return true;
    return order.status === filter;
  });

  return (
    <div className="admin-page" dir="rtl">
      <div className="admin-container">
        <div className="admin-header">
          <div className="header-title">
            <h1>🦇 Batcave Panel</h1>
            <span className="live-badge">Live Connection</span>
          </div>
          
          <div className="header-actions">
            <div className="filter-tabs">
              <button className={filter === 'ALL' ? 'active' : ''} onClick={() => setFilter('ALL')}>الكل</button>
              <button className={filter === 'PENDING' ? 'active' : ''} onClick={() => setFilter('PENDING')}>قيد الانتظار</button>
              <button className={filter === 'COMPLETED' ? 'active' : ''} onClick={() => setFilter('COMPLETED')}>مكتملة</button>
            </div>
            
            <div className="admin-controls">
                <button onClick={fetchOrders} className="refresh-btn" title="تحديث البيانات">
                    <RefreshCw size={18} />
                </button>
                <button onClick={handleLogout} className="logout-btn" title="تسجيل الخروج">
                    <LogOut size={18} />
                </button>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="w-16">#</th>
                <th className="w-24">النوع</th>
                <th className="w-40">المنصة / ID</th>
                <th className="w-32">المبلغ</th>
                <th>تفاصيل العملية / الإثبات</th>
                <th className="w-32">الحالة</th>
                <th className="w-40">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className={`order-row ${order.status.toLowerCase()}-row`}>
                  <td className="id-cell">#{order.id}</td>
                  <td>
                    <span className={`type-badge ${order.operationType}`}>
                      {order.operationType === 'recharge' ? 'شحن' : 'سحب'}
                    </span>
                  </td>
                  <td>
                    <div className="user-info">
                      <span className="platform">{order.platform}</span>
                      <span className="player-id">{order.playerId}</span>
                    </div>
                  </td>
                  <td className="amount-cell">{order.amount} DH</td>

                  <td className="details-cell">
                    <div className="details-stack">
                      {order.phone && (
                        <div className="contact-box">
                          <span className="label">التواصل:</span>
                          <button 
                            className="whatsapp-contact-btn" 
                            onClick={() => openWhatsApp(order.phone!, order.id)}
                          >
                            <MessageCircle size={14} />
                            <span>{order.phone}</span>
                          </button>
                        </div>
                      )}

                      {order.operationType === 'sahl' && (
                        <div className="withdraw-grid-info">
                          <div className="info-item"><span className="label">الطريقة:</span> <span className="value">{order.withdrawMethod}</span></div>
                          {order.bank && <div className="info-item"><span className="label">البنك:</span> <span className="value">{order.bank}</span></div>}
                          {order.rib && <div className="info-item"><span className="label">RIB:</span> <span className="value select-all">{order.rib}</span></div>}
                          {order.fullName && <div className="info-item"><span className="label">الاسم:</span> <span className="value">{order.fullName}</span></div>}
                          {order.code && <div className="info-item code-box"><span className="label">الكود:</span> <span className="value">{order.code}</span></div>}
                        </div>
                      )}

                      {order.proofScreenshot ? (
                        <div className="proof-thumbnail-container" onClick={() => window.open(`http://localhost:3000/uploads/${order.proofScreenshot}`, '_blank')}>
                          <img 
                            src={`http://localhost:3000/uploads/${order.proofScreenshot}`} 
                            alt="Receipt" 
                            className="proof-thumb"
                          />
                          <span className="click-hint"><ExternalLink size={10} /> عرض الوصل</span>
                        </div>
                      ) : (
                        order.operationType === 'recharge' && <span className="no-data">بدون صورة</span>
                      )}
                    </div>
                  </td>

                  <td>
                    <span className={`status-pill ${order.status}`}>
                      {order.status === 'PENDING' && 'قيد المعالجة'}
                      {order.status === 'COMPLETED' && 'مكتمل'}
                      {order.status === 'REJECTED' && 'مرفوض'}
                    </span>
                  </td>

                  <td>
                    <div className="actions-flex">
                      {order.status === 'PENDING' && (
                        <>
                          <button onClick={() => updateStatus(order.id, 'COMPLETED')} className="action-btn approve"><Check size={18} /></button>
                          <button onClick={() => updateStatus(order.id, 'REJECTED')} className="action-btn reject"><X size={18} /></button>
                        </>
                      )}
                      <button onClick={() => deleteOrder(order.id)} className="action-btn delete"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}