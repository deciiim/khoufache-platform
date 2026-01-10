import { useNavigate } from 'react-router-dom';
import { Upload, CreditCard } from 'lucide-react';

// Import Payment Assets
import cihImg from '../assets/Cih-bank.png';
import attijariImg from '../assets/attijari.png';
import cashPlusImg from '../assets/cashPlusjpg.jpg';
import orangeImg from '../assets/Orange.png';
import inwiImg from '../assets/inwi.png';

// Import Platform Assets
import xbetImg from '../assets/1x.png';
import melbetImg from '../assets/MEL.jpeg';
import linebetImg from '../assets/line.png';
import './Home.css'; // <--- ADD THIS LINE
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      
      {/* Animated Bat Background */}
      <div className="bat-bg">
        <div className="bat"></div>
        <div className="bat"></div>
        <div className="bat"></div>
        <div className="bat"></div>
      </div>

      {/* Hero Section */}
      <div className="hero-section relative z-10">
        <div className="container">
          <div className="hero-grid">
            
            {/* Text Side */}
            <div className="hero-text">
              <h1>
                حصري و <span className="text-highlight">جديد</span>
              </h1>
              <p>
                جوائز و هدايا كل شهر مع منصة <span className="text-highlight">Khoufach</span>. 
                اشحن حسابك في 30 ثانية واستفد من أسرع خدمة في المغرب.
              </p>
              
              <div className="btn-group">
                {/* Updated: Links to internal Recharge Page */}
                <button 
                  onClick={() => navigate('/recharge')}
                  className="btn btn-green"
                >
                  <Upload size={20} />
                  شحن الحساب
                </button>

                <button 
                  onClick={() => navigate('/withdraw')}
                  className="btn btn-red"
                >
                   <CreditCard size={20} />
                   سحب الأرباح
                </button>
              </div>
            </div>

            {/* Image Side */}
            <div className="hero-image-wrapper">
               <img 
                 src="https://placehold.co/600x400/1e1e1e/FFD700?text=Khoufach+Promo" 
                 alt="Promo" 
                 className="hero-image"
               />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Footer */}
      <div className="payment-methods relative z-10">
        <div className="container">
          <span className="payment-title">طرق الدفع المعتمدة</span>
          <div className="logos-row">
            <img src={cihImg} alt="CIH" className="payment-logo" />
            <img src={attijariImg} alt="Attijari" className="payment-logo" />
            <img src={cashPlusImg} alt="CashPlus" className="payment-logo" />
            <img src={orangeImg} alt="Orange" className="payment-logo" />
            <img src={inwiImg} alt="Inwi" className="payment-logo" />
          </div>
        </div>
      </div>

      {/* Platforms Footer */}
      <div className="platforms-section relative z-10">
        <div className="container text-center">
          <span className="payment-title" style={{color: '#666', fontSize: '0.9rem'}}>المنصات المدعومة</span>
          <div className="logos-row grayscale-hover">
            <img src={xbetImg} alt="1xBet" className="platform-logo" />
            <img src={melbetImg} alt="Melbet" className="platform-logo" />
            <img src={linebetImg} alt="Linebet" className="platform-logo" />
          </div>
        </div>
      </div>

    </div>
  );
}