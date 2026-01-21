import React, { useState } from 'react';
import axios from 'axios';
import { ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

interface Props {
  config: {
    title: string;
    image: string;
  };
  onBack: () => void;
}

export default function WithdrawForm({ config, onBack }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [file, setFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    app: '1xbet',
    playerId: '',     
    amount: '',       
    code: '',         
    bank: 'CIH Bank',      
    fullName: '',     
    rib: '',           
    phone: '',
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Default logic: We send the raw amount. Admin decides validation.
    // Ideally, the admin checks if the ID is actually registered with promo code.
    const rawAmount = parseFloat(formData.amount);
    const commission = rawAmount * 0.10;
    const amountWithCommission = rawAmount - commission;

    const data = new FormData();
    data.append('platform', formData.app);
    data.append('operationType', 'sahl'); 
    data.append('amount', formData.amount);
    
    // We send the 'Potential' received amount (with -10%) as a hint to admin, 
    // but the text warning explains the rule to the user.
    data.append('receivedAmount', amountWithCommission.toString());
    
    data.append('playerId', formData.playerId); 
    data.append('withdrawMethod', config.title);
    data.append('bank', formData.bank);
    data.append('fullName', formData.fullName);
    data.append('rib', formData.rib);
    data.append('phone', formData.phone);
    data.append('code', formData.code);
    
    if (file) data.append('file', file);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      await axios.post(`${API_URL}/transactions`, data);
      setStatus('success');
      setTimeout(() => { 
        setStatus('idle'); 
        onBack(); 
      }, 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="melfoot-form-layout animate-fade-in">
      <div className="melfoot-info-col">
        <div className="bank-illustration">
          <img src={config.image} alt={config.title} />
          <h3>{config.title}</h3>
          <div className="info-box">
            <p className="text-sm text-gray-500 mb-2">استخدم العنوان الخاص بنا لسحب أموالك</p>
            <strong className="block text-lg">Agadir</strong> <br />
            <strong className="block text-lg">khofach</strong>
          </div>
        </div>
      </div>

      <div className="melfoot-input-col">
        <div className="form-header-simple">
          <button type="button" onClick={onBack} className="back-link">
            <ArrowRight size={20} className="ml-1"/> رجوع
          </button>
        </div>

        {status === 'success' ? (
           <div className="success-message">
             <CheckCircle size={60} color="#16a34a" style={{margin: '0 auto 20px'}} />
             <h3>تم إرسال الطلب!</h3>
             <p>سيتم مراجعة طلبك وتزويدك بالمستجدات عبر الهاتف.</p>
           </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="melfoot-form">
            
            {/* --- NEW WARNING BANNER --- */}
            <div className="warning-banner">
                <div className="warning-icon">
                    <AlertTriangle size={24} />
                </div>
                <div className="warning-text">
                    <h4>تنبيه حول الاقتطاع</h4>
                    <ul>
                        <li>
                            <span className="bullet success"></span>
                            <strong>للمسجلين بكود برومو (khofo1):</strong> ستتوصل بالمبلغ كاملاً.
                        </li>
                        <li>
                            <span className="bullet danger"></span>
                            <strong>لغير المسجلين:</strong> سيتم اقتطاع <strong>10%</strong> من المبلغ.
                        </li>
                    </ul>
                </div>
            </div>
            {/* -------------------------- */}

            <div className="form-group">
              <label>تطبيق اللاعب</label>
              <select value={formData.app} onChange={e => setFormData({...formData, app: e.target.value})}>
                <option value="1xbet">1XBET</option>
                <option value="melbet">MELBET</option>
                <option value="linebet">LINEBET</option>
              </select>
            </div>

            <div className="form-group">
              <label>أيدي اللاعب (ID)</label>
              <input type="text" placeholder="أدخل ID الخاص بك" required 
                value={formData.playerId} onChange={e => setFormData({...formData, playerId: e.target.value})} />
            </div>

            <div className="form-group">
              <label>المبلغ المطلوب سحبه</label>
              <input type="number" placeholder="مثال: 500" required 
                value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
            </div>

            <div className="form-group phone-group">
              <label>رقم الهاتف (WhatsApp)</label>
              <div className="phone-input-wrapper">
                <input type="text" placeholder="06XXXXXXXX" required
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                <div className="country-badge">🇲🇦</div>
              </div>
            </div>

            <div className="form-group">
              <label>اختيار البنك</label>
              <select value={formData.bank} onChange={e => setFormData({...formData, bank: e.target.value})}>
                <option>CIH Bank</option>
                <option>Attijariwafa Bank</option>
                <option>Cash Plus</option>
                <option>Wafacash</option>
                <option>Barid Bank</option>
              </select>
            </div>

            <div className="form-group">
              <label>الاسم الكامل (كما في البطاقة)</label>
              <input type="text" placeholder="الاسم الكامل" required
                value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            </div>

            <div className="form-group">
              <label>رقم الحساب / RIB</label>
              <input type="text" placeholder="24 رقم الخاص بالحساب" required 
                value={formData.rib} onChange={e => setFormData({...formData, rib: e.target.value})} />
            </div>

            <div className="form-group">
              <label>كود السحب</label>
              <input type="text" placeholder="أدخل كود السحب من التطبيق" 
                value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
            </div>

            <button disabled={status === 'loading'} className="melfoot-submit-btn">
              {status === 'loading' ? 'جاري الإرسال...' : 'إرسال طلب السحب'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}