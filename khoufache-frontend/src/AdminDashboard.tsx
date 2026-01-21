import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Check, X, RefreshCw, Trash2, ExternalLink, MessageCircle, LogOut, ThumbsUp, Filter } from 'lucide-react';
import './AdminDashboard.css';

interface Transaction {
  id: number;
  platform: string;
  operationType: string;
  playerId: string;
  amount: number;
  receivedAmount?: number;
  usedPromo?: boolean;
  paymentMethod?: string;
  proofScreenshot?: string;
  promoScreenshot?: string; 
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
  
  // --- FILTERS STATE ---
  const [statusFilter, setStatusFilter] = useState('ALL'); // PENDING, COMPLETED...
  const [typeFilter, setTypeFilter] = useState('ALL');     // ALL, recharge, sahl
  
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/transactions`, getAuthHeader());
      setOrders(res.data.sort((a: any, b: any) => b.id - a.id));
    } catch (error: any) {
      if (error.response?.status === 401) handleLogout();
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    if (!window.confirm(`هل أنت متأكد من تغيير الحالة إلى ${newStatus}؟`)) return;
    try {
      await axios.patch(`${API_URL}/transactions/${id}`, { status: newStatus }, getAuthHeader());
      fetchOrders();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const deleteOrder = async (id: number) => {
    if (!window.confirm('⚠️ هل أنت متأكد من حذف هذا الطلب نهائياً؟')) return;
    try {
      await axios.delete(`${API_URL}/transactions/${id}`, getAuthHeader());
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
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '212' + cleanPhone.substring(1);
    }
    const message = encodeURIComponent(`السلام عليكم، بخصوص طلبكم رقم #${id} على منصة Khoufache:`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  // --- UPDATED FILTER LOGIC ---
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || order.operationType === typeFilter;
    return matchesStatus && matchesType;
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
            
            {/* --- TYPE FILTER (Recharge vs Withdraw) --- */}
            <div className="filter-group">
                <span className="filter-label"><Filter size={12}/> النوع:</span>
                <div className="filter-tabs">
                  <button className={typeFilter === 'ALL' ? 'active' : ''} onClick={() => setTypeFilter('ALL')}>الكل</button>
                  <button className={typeFilter === 'recharge' ? 'active' : ''} onClick={() => setTypeFilter('recharge')}>شحن</button>
                  <button className={typeFilter === 'sahl' ? 'active' : ''} onClick={() => setTypeFilter('sahl')}>سحب</button>
                </div>
            </div>

            {/* --- STATUS FILTER --- */}
            <div className="filter-group">
                <span className="filter-label"><Check size={12}/> الحالة:</span>
                <div className="filter-tabs">
                  <button className={statusFilter === 'ALL' ? 'active' : ''} onClick={() => setStatusFilter('ALL')}>الكل</button>
                  <button className={statusFilter === 'PENDING' ? 'active' : ''} onClick={() => setStatusFilter('PENDING')}>قيد الانتظار</button>
                  <button className={statusFilter === 'COMPLETED' ? 'active' : ''} onClick={() => setStatusFilter('COMPLETED')}>مكتملة</button>
                </div>
            </div>

            <div className="admin-controls">
                <button onClick={fetchOrders} className="refresh-btn"><RefreshCw size={18} /></button>
                <button onClick={handleLogout} className="logout-btn"><LogOut size={18} /></button>
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
                <th className="w-40">المبلغ / البرومو</th>
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
                      {order.paymentMethod && <span className="method-label-mini">{order.paymentMethod}</span>}
                    </div>
                  </td>

                  <td className="amount-cell">
                    <div className="amount-stack">
                      <span className="main-amount">{order.amount} DH</span>
                      {order.operationType === 'recharge' && (
                        <div className="promo-status-row">
                          {order.usedPromo ? (
                            <span className="promo-tag success">Code Promo ✅</span>
                          ) : (
                            <span className="promo-tag fail">Code Promo ❌</span>
                          )}
                        </div>
                      )}
                      <div className="received-total">
                         الصافي: <span dir="ltr">{order.receivedAmount || order.amount} DH</span>
                      </div>
                    </div>
                  </td>

                  <td className="details-cell">
                    <div className="details-stack">
                      {order.phone && (
                        <div className="contact-box">
                          <button className="whatsapp-contact-btn" onClick={() => openWhatsApp(order.phone!, order.id)}>
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

                      <div className="proofs-row">
                          {order.proofScreenshot && (
                            <div className="proof-thumbnail-container" onClick={() => window.open(`${API_URL}/uploads/${order.proofScreenshot}`, '_blank')}>
                              <img src={`${API_URL}/uploads/${order.proofScreenshot}`} alt="Receipt" className="proof-thumb" />
                              <span className="click-hint"><ExternalLink size={10} /> وصل الدفع</span>
                            </div>
                          )}

                          {order.promoScreenshot && (
                            <div className="proof-thumbnail-container promo-proof" onClick={() => window.open(`${API_URL}/uploads/${order.promoScreenshot}`, '_blank')}>
                              <img src={`${API_URL}/uploads/${order.promoScreenshot}`} alt="Promo" className="proof-thumb" />
                              <span className="click-hint"><ThumbsUp size={10} /> إثبات التفاعل</span>
                            </div>
                          )}
                      </div>
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