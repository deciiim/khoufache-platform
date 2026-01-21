import { MessageCircle, Building2 } from 'lucide-react';

const WHATSAPP_NUMBER = "212726779414"; 

interface Props {
  // Updated type to only allow 'bank'
  onSelect: (type: 'bank') => void;
}

export default function WithdrawSelection({ onSelect }: Props) {
  return (
    <div className="withdraw-selection-grid">
      {/* 1. WhatsApp - Stays as a direct link */}
      <div 
        onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Salam, bghit ns7b`, '_blank')}
        className="withdraw-card"
      >
        <div className="icon-circle" style={{ color: '#16a34a' }}>
          <MessageCircle size={40} />
        </div>
        <h3>وكالة (WhatsApp)</h3>
        <p>تواصل مباشرة مع الوكيل للسحب الفوري</p>
      </div>

      {/* 2. Bank Transfer - The only form-based option remaining */}
      <div onClick={() => onSelect('bank')} className="withdraw-card">
        <div className="icon-circle" style={{ color: '#2563eb' }}>
          <Building2 size={40} />
        </div>
        <h3>التحويل البنكي</h3>
        <p>اسحب أرباحك مباشرة إلى حسابك البنكي</p>
      </div>
    </div>
  );
}