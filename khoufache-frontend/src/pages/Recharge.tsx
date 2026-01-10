import React, { useState } from 'react';
import axios from 'axios';
import { ChevronLeft, Upload, CheckCircle, Send, MessageCircle, CreditCard, Banknote, Landmark, Phone } from 'lucide-react';
import './Recharge.css';

const WHATSAPP_NUMBER = "212607547900"; 

export default function Recharge() {
  const [activeTab, setActiveTab] = useState<'selection' | 'whatsapp' | 'form'>('selection');
  const [platform, setPlatform] = useState('1xbet');
  const [formData, setFormData] = useState({ playerId: '', amount: '', phone: '' });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleWhatsappClick = (method: string) => {
    const message = `Salam Khoufache, bghit ncharger via *${method}*`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { alert('المرجو رفع صورة الوصل'); return; }
    setStatus('loading');
    
    const data = new FormData();
    data.append('platform', platform);
    data.append('operationType', 'recharge');
    data.append('playerId', formData.playerId);
    data.append('amount', formData.amount);
    data.append('phone', formData.phone);
    data.append('file', file);

    try {
      await axios.post('http://localhost:3000/transactions', data);
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setFormData({ playerId: '', amount: '', phone: '' });
        setFile(null);
        setActiveTab('selection');
      }, 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const paymentMethods = [
    { name: 'Orange Money', color: '#ff7900', icon: <SmartphoneIcon /> },
    { name: 'Inwi Money', color: '#8d169d', icon: <SmartphoneIcon /> },
    { name: 'CIH Bank', color: '#f37021', icon: <Landmark /> },
    { name: 'Attijariwafa', color: '#fbbf24', icon: <Landmark /> },
    { name: 'BMCE Bank', color: '#0ea5e9', icon: <Landmark /> },
    { name: 'Barid Bank', color: '#eab308', icon: <Landmark /> },
    { name: 'Cash Plus', color: '#16a34a', icon: <Banknote /> },
    { name: 'USDT', color: '#22c55e', icon: <CreditCard /> }
  ];

  return (
    <div className="recharge-page" dir="rtl">
      <div className="recharge-header">
        <h2>شحن الحساب</h2>
        <p>اختر الطريقة التي تفضلها لشحن حسابك في ثواني</p>
      </div>

      <div className="recharge-container">
        {activeTab === 'selection' && (
          <div className="recharge-selection-grid animate-fade-in">
            <div onClick={() => setActiveTab('whatsapp')} className="recharge-card whatsapp">
              <div className="icon-circle green"><MessageCircle size={32} /></div>
              <h3>تواصل عبر الواتساب</h3>
              <p>تحدث مع الوكيل مباشرة لاختيار وسيلة الدفع</p>
            </div>

            <div onClick={() => setActiveTab('form')} className="recharge-card form">
              <div className="icon-circle yellow"><Upload size={32} /></div>
              <h3>رفع الوصل (تلقائي)</h3>
              <p>ارفع صورة التحويل هنا وسيتم شحن حسابك أوتوماتيكياً</p>
            </div>
          </div>
        )}

        {activeTab === 'whatsapp' && (
          <div className="methods-view animate-fade-in">
            <button onClick={() => setActiveTab('selection')} className="back-btn-simple">
              <ChevronLeft size={20} /> رجوع
            </button>
            <h3 className="view-title">اختر وسيلة الدفع للمراسلة</h3>
            <div className="methods-grid">
              {paymentMethods.map((method) => (
                <div key={method.name} className="method-item" onClick={() => handleWhatsappClick(method.name)}>
                  <div className="method-box" style={{ color: method.color, borderColor: method.color }}>
                    {method.icon}
                    <span>{method.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'form' && (
          <div className="upload-form-wrapper animate-fade-in">
            <div className="form-card-header">
              <button onClick={() => setActiveTab('selection')} className="back-icon-btn"><ChevronLeft size={24} /></button>
              <span>رفع وصل الشحن</span>
            </div>
            
            {status === 'success' ? (
              <div className="success-screen">
                <CheckCircle size={80} color="#16a34a" className="animate-bounce" />
                <h3>تم استلام الطلب!</h3>
                <p>جاري التحقق من الوصل...</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="recharge-form">
                <div className="form-group">
                  <label>المنصة</label>
                  <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                    <option value="1xbet">1XBET</option>
                    <option value="melbet">MELBET</option>
                    <option value="linebet">LINEBET</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>رقم الحساب (ID)</label>
                  <input required type="text" placeholder="12345678" value={formData.playerId} onChange={(e) => setFormData({...formData, playerId: e.target.value})} />
                </div>

                <div className="form-group phone-group">
                  <label>رقم الهاتف (WhatsApp)</label>
                  <div className="phone-input-wrapper">
                    <input 
                      required 
                      type="text" 
                      placeholder="06XXXXXXXX" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                    />
                    <div className="country-badge">🇲🇦</div>
                  </div>
                </div>

                <div className="form-group">
                  <label>المبلغ (DH)</label>
                  <input required type="number" placeholder="100" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
                </div>

                <div className="form-group">
                  <label>صورة الوصل</label>
                  <div className={`upload-dropzone ${file ? 'has-file' : ''}`}>
                    <input required type="file" accept="image/*" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
                    <Upload size={30} className={file ? 'text-green-500' : ''} />
                    <span>{file ? file.name : "اضغط هنا لاختيار الصورة"}</span>
                  </div>
                </div>

                <button disabled={status === 'loading'} className="recharge-submit-btn">
                  {status === 'loading' ? (
                    <div className="flex items-center gap-2">جاري الرفع...</div>
                  ) : 'إرسال الطلب'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SmartphoneIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
}