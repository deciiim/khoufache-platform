import { useState } from 'react';
import WithdrawSelection from '../components/WithdrawSelection';
import WithdrawForm from '../components/WithdrawForm';
import './Withdraw.css';
const WITHDRAW_TYPES = {
  bank: {
    title: 'التحويل البنكي',
    image: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png',
  },
  fast: {
    title: 'تحويل سريع',
    image: 'https://cdn-icons-png.flaticon.com/512/10149/10149459.png',
  },
  agency: {
    title: 'وكالة تحويل الأموال',
    image: 'https://cdn-icons-png.flaticon.com/512/3280/3280979.png',
  }
};

export default function Withdraw() {
  const [view, setView] = useState<'selection' | 'form'>('selection');
  const [selectedType, setSelectedType] = useState<keyof typeof WITHDRAW_TYPES>('bank');

  return (
    <div className="withdraw-page" dir="rtl">
      <div className="withdraw-header">
        <h2>طرق السحب</h2>
        <p>اختر الطريقة التي تناسبك لسحب أموالك</p>
      </div>

      <div className="withdraw-container">
        {view === 'selection' && (
          <WithdrawSelection 
            onSelect={(type) => {
              setSelectedType(type);
              setView('form'); // This switches the view to Form
            }} 
          />
        )}

        {view === 'form' && (
          <WithdrawForm 
            config={WITHDRAW_TYPES[selectedType]} 
            onBack={() => setView('selection')} // This switches back to Grid
          />
        )}
      </div>
    </div>
  );
}