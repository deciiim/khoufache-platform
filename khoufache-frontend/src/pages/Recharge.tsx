import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { ChevronLeft, Upload, CheckCircle, MessageCircle, Info, Landmark, Copy, CreditCard, ThumbsUp } from 'lucide-react';
import Bats from '../components/Bats'; 
import './Recharge.css';

// Ensure these images exist in your src/assets/ folder
import orangeLogo from '../assets/Orange.png';
import inwiLogo from '../assets/inwi.png';
import cihLogo from '../assets/Cih-bank.png';
import attijariLogo from '../assets/attijari.png';
import baridLogo from '../assets/barid-bank.png';
import cashPlusLogo from '../assets/cashPlusjpg.jpg';
import wafacashLogo from '../assets/wafach.jpg'
// Note: Ensure you have a wafacash image, or use cashPlusLogo as placeholder
import wafaLogo from '../assets/cashPlusjpg.jpg'; 

const WHATSAPP_BANKS = "212722067894"; 
const WHATSAPP_TELECOM = "212665776063";

// --- 1. DEFINE YOUR RIBS (BANKS ONLY) ---
const BANK_DETAILS: Record<string, { rib: string; name: string }> = {
  'CIH Bank': { rib: '5658108211013800', name: 'Khofach digital' },
  'Attijariwafa Bank': { rib: '007010000679800030481933', name: 'Khoufache Shop' },
  'Barid Bank': { rib: '13287213', name: 'abdessalam araich' }
};

export default function Recharge() {
  const [activeTab, setActiveTab] = useState<'selection' | 'whatsapp' | 'form'>('selection');
  const [platform, setPlatform] = useState('1xbet');
  const [selectedBank, setSelectedBank] = useState('CIH Bank');
  
  // --- STATES FOR PROMO ---
  const [hasPromoCode, setHasPromoCode] = useState(false);
  const [promoFile, setPromoFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({ playerId: '', amount: '', phone: '' });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  // --- HELPER TO COPY RIB ---
  const handleCopyRib = () => {
    const textToCopy = BANK_DETAILS[selectedBank]?.rib || '';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calculation = useMemo(() => {
    const amt = parseFloat(formData.amount) || 0;
    if (hasPromoCode) return { receive: amt, commission: 0 };
    const commission = amt * 0.10;
    return { receive: amt - commission, commission };
  }, [formData.amount, hasPromoCode]);

  // --- WHATSAPP ROUTING LOGIC ---
  const handleWhatsappClick = (methodName: string) => {
    // If the method is one of the Telecom/Cash services, use the Telecom number
    const isTelecomOrCash = [
        'Orange Money', 
        'Inwi Money', 
        'Cash Plus', 
        'Wafacash'
    ].includes(methodName);

    const targetNumber = isTelecomOrCash ? WHATSAPP_TELECOM : WHATSAPP_BANKS;
    const message = `Salam Khoufache, bghit ncharger via *${methodName}*`;
    
    window.open(`https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) { alert('المرجو رفع صورة الوصل (Payment Receipt)'); return; }
    
    if (hasPromoCode && !promoFile) {
        alert('المرجو رفع صورة إثبات التفاعل (Like/Share) للاستفادة من البرومو');
        return;
    }

    setStatus('loading');
    
    const data = new FormData();
    data.append('platform', platform);
    data.append('paymentMethod', selectedBank);
    data.append('operationType', 'recharge');
    data.append('playerId', formData.playerId);
    data.append('amount', formData.amount);
    data.append('phone', formData.phone);
    data.append('receivedAmount', calculation.receive.toString());
    data.append('usedPromo', hasPromoCode.toString()); 

    data.append('file', file);

    if (hasPromoCode && promoFile) {
        data.append('promoFile', promoFile);
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      await axios.post(`${API_URL}/transactions`, data);
      
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setFormData({ playerId: '', amount: '', phone: '' });
        setFile(null);
        setPromoFile(null);
        setHasPromoCode(false);
        setActiveTab('selection');
      }, 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  // --- METHODS DISPLAYED IN WHATSAPP TAB ---
  const whatsappMethods = [
    { name: 'Cash Plus', logo: cashPlusLogo },
    { name: 'Wafacash', logo: wafacashLogo }, // Ensure you have this logo or reuse cashPlus
    { name: 'Orange Money', logo: orangeLogo },
    { name: 'Inwi Money', logo: inwiLogo },
  ];

  return (
    <div className="recharge-page" dir="rtl">
      
      <Bats />

      <div className="recharge-header" style={{ position: 'relative', zIndex: 10 }}>
        <h2>شحن الحساب</h2>
        <p>اختر الطريقة التي تفضلها لشحن حسابك في ثواني</p>
      </div>

      <div className="recharge-container" style={{ position: 'relative', zIndex: 10 }}>
        
        {/* --- TAB SELECTION --- */}
        {activeTab === 'selection' && (
          <div className="recharge-selection-grid animate-fade-in">
            {/* OPTION 1: WHATSAPP (CashPlus, Wafa, Orange, Inwi) */}
            <div onClick={() => setActiveTab('whatsapp')} className="recharge-card whatsapp">
              <div className="icon-circle green"><MessageCircle size={32} /></div>
              <h3>تواصل عبر الواتساب</h3>
              <p>Cash Plus, Wafacash, Orange, Inwi</p>
            </div>

            {/* OPTION 2: FORM (Banks Only) */}
            <div onClick={() => setActiveTab('form')} className="recharge-card form">
              <div className="icon-circle yellow"><Upload size={32} /></div>
              <h3>دفع بنكي (تلقائي)</h3>
              <p>CIH Bank, Attijariwafa, Barid Bank</p>
            </div>
          </div>
        )}

        {/* --- VIEW: WHATSAPP LIST --- */}
        {activeTab === 'whatsapp' && (
          <div className="methods-view animate-fade-in">
            <button onClick={() => setActiveTab('selection')} className="back-btn-simple">
              <ChevronLeft size={20} /> رجوع
            </button>
            <h3 className="view-title">اختر وسيلة الدفع للمراسلة</h3>
            <div className="methods-grid">
              {whatsappMethods.map((method) => (
                <div key={method.name} className="method-item" onClick={() => handleWhatsappClick(method.name)}>
                  <div className="method-box-branded">
                    <img src={method.logo} alt={method.name} className="method-logo-img" />
                    <span>{method.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- VIEW: BANK FORM --- */}
        {activeTab === 'form' && (
          <div className="upload-form-wrapper animate-fade-in">
            <div className="form-card-header">
              <button onClick={() => setActiveTab('selection')} className="back-icon-btn"><ChevronLeft size={24} /></button>
              <span>رفع وصل الشحن (البنك)</span>
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
                  <label><Landmark size={16} /> البنك المستخدم</label>
                  <select 
                    className="bank-select"
                    value={selectedBank} 
                    onChange={(e) => setSelectedBank(e.target.value)}
                  >
                    {/* ONLY SHOW BANKS HERE */}
                    <option value="CIH Bank">CIH Bank</option>
                    <option value="Attijariwafa Bank">Attijariwafa Bank</option>
                    <option value="Barid Bank">Barid Bank</option>
                  </select>
                </div>

                {BANK_DETAILS[selectedBank] && (
                  <div className="bank-details-card">
                    <div className="bank-card-header">
                      <CreditCard size={18} />
                      <span>معلومات التحويل لـ {selectedBank}</span>
                    </div>
                    <div className="bank-rib-display">
                       <span className="rib-label">RIB / رقم الحساب:</span>
                       <div className="rib-value-row">
                          <span className="rib-number">{BANK_DETAILS[selectedBank].rib}</span>
                          <button type="button" onClick={handleCopyRib} className="copy-btn">
                             {copied ? <CheckCircle size={16} color="#22c55e" /> : <Copy size={16} />}
                          </button>
                       </div>
                       <span className="rib-name">الاسم: {BANK_DETAILS[selectedBank].name}</span>
                    </div>
                  </div>
                )}

                <div className="promo-toggle-section">
                  <div className="promo-content">
                    <div className="promo-text">
                      <h4>كود برومو (khofo1)</h4>
                      <p>استفد من عمولة 0% على جميع شحناتك</p>
                    </div>
                    <label className="promo-switch">
                      <input 
                        type="checkbox" 
                        checked={hasPromoCode} 
                        onChange={(e) => setHasPromoCode(e.target.checked)} 
                      />
                      <span className="promo-slider"></span>
                    </label>
                  </div>

                  {hasPromoCode && (
                    <div className="promo-upload-mini animate-fade-in">
                        <label className="promo-upload-label">
                            <ThumbsUp size={14} /> 
                            <span>إثبات التفاعل </span>
                        </label>
                        <div className={`mini-dropzone ${promoFile ? 'has-file' : ''}`}>
                            <input 
                                required={hasPromoCode}
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => setPromoFile(e.target.files ? e.target.files[0] : null)} 
                            />
                            <span>{promoFile ? promoFile.name : "اضغط هنا لرفع الإثبات"}</span>
                        </div>
                    </div>
                  )}
                </div>

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

                <div className="form-group">
                  <label>المبلغ المراد إرساله (DH)</label>
                  <input required type="number" placeholder="100" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
                </div>

                <div className="calculation-card">
                   <div className="calc-row">
                      <span>ستتوصل بـ:</span>
                      <span className="calc-value">{calculation.receive} DH</span>
                   </div>
                   <div className="calc-info">
                      <Info size={14} />
                      {hasPromoCode ? 
                        "عمولة 0% بفضل كود البرومو" : 
                        `عمولة الاقتطاع (10%): ${calculation.commission} DH`}
                   </div>
                </div>

                <div className="form-group">
                  <label>رقم الهاتف (WhatsApp)</label>
                  <input required type="text" placeholder="06XXXXXXXX" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>

                <div className="form-group">
                  <label>صورة الوصل (Payment Receipt)</label>
                  <div className={`upload-dropzone ${file ? 'has-file' : ''}`}>
                    <input required type="file" accept="image/*" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
                    <Upload size={30} />
                    <span>{file ? file.name : "اضغط هنا لاختيار الصورة"}</span>
                  </div>
                </div>

                <button disabled={status === 'loading'} className="recharge-submit-btn">
                  {status === 'loading' ? 'جاري الرفع...' : 'إرسال الطلب'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}