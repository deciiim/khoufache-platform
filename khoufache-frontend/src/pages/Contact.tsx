import { useState } from 'react';
import axios from 'axios';
import { Phone, Mail, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import './Contact.css'
export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Send to NestJS Backend
      await axios.post('http://localhost:3000/contact', formData);
      
      setStatus('success');
      setFormData({ name: '', phone: '', email: '', message: '' });
      
      // Reset status after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="contact-page" dir="rtl">
      <div className="contact-container">
        
        <div className="contact-header">
          <h2>تواصل معنا</h2>
          <p>فريق الدعم جاهز للإجابة على استفساراتكم 24/7</p>
        </div>

        <div className="contact-card">
          
          {/* Left Side: Contact Info (Updated with your details) */}
          <div className="contact-info-side">
            <div className="decor-blob top-right"></div>
            <div className="decor-blob bottom-left"></div>

            <div className="info-content relative z-10">
              <h3>معلومات الاتصال</h3>
              <p className="info-subtitle">يمكنك مراسلتنا عبر الوسائل التالية</p>

              <div className="contact-methods">
                <div className="method-row">
                  <div className="icon-box"><Phone size={20} /></div>
                  <span className="method-text dir-ltr">212607547900</span>
                </div>

                <div className="method-row">
                  <div className="icon-box"><Mail size={20} /></div>
                  <span className="method-text text-sm">youssefabayda207@gmail.com</span>
                </div>

                <div className="method-row">
                  <div className="icon-box"><MapPin size={20} /></div>
                  <span className="method-text">Taroudant, Morocco</span>
                </div>
              </div>
            </div>

            <div className="info-footer relative z-10">
              © 2026 Khoufache. All rights reserved.
            </div>
          </div>

          {/* Right Side: Form (Functional) */}
          <div className="contact-form-side">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <CheckCircle size={60} className="text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800">تم الإرسال بنجاح!</h3>
                <p className="text-gray-500">شكراً لك، سنتواصل معك في أقرب وقت.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>الاسم</label>
                    <input 
                      required name="name" 
                      type="text" placeholder="الاسم الكامل" 
                      value={formData.name} onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>الهاتف</label>
                    <input 
                      required name="phone" 
                      type="text" placeholder="06XXXXXXXX" 
                      value={formData.phone} onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>البريد الإلكتروني</label>
                  <input 
                    required name="email" 
                    type="email" placeholder="name@email.com" 
                    value={formData.email} onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>الرسالة</label>
                  <textarea 
                    required name="message" 
                    rows={4} placeholder="اكتب رسالتك هنا..." 
                    value={formData.message} onChange={handleChange}
                  />
                </div>

                <button type="submit" disabled={status === 'loading'} className="contact-submit-btn">
                  {status === 'loading' ? (
                    <>جاري الإرسال <Loader2 size={18} className="animate-spin" /></>
                  ) : (
                    <>إرسال الرسالة <Send size={18} /></>
                  )}
                </button>
                
                {status === 'error' && (
                  <p className="text-red-500 text-center mt-3 text-sm">حدث خطأ، حاول مرة أخرى.</p>
                )}
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}