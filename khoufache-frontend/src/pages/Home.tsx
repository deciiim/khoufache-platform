import { useNavigate } from 'react-router-dom';
import { Upload, CreditCard } from 'lucide-react';
import './Home.css';

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
import Promoimage from '../assets/promo.jpg'

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      
      {/* --- THE BAT SWARM (UPDATED) --- */}
      <div className="bat-bg">
        {/* Foreground bats (larger, faster) */}
        <div className="bat left" style={{ top: '15%' }}></div>
        <div className="bat right" style={{ top: '35%', animationDelay: '2s' }}></div>
        <div className="bat left" style={{ top: '55%', animationDelay: '4s' }}></div>
        <div className="bat right" style={{ top: '75%', animationDelay: '1s' }}></div>

        {/* Mid-ground bats (medium size) */}
        <div className="bat left medium" style={{ top: '10%', animationDelay: '7s', animationDuration: '20s' }}></div>
        <div className="bat right medium" style={{ top: '45%', animationDelay: '5s', animationDuration: '22s' }}></div>
        <div className="bat left medium" style={{ top: '65%', animationDelay: '9s', animationDuration: '19s' }}></div>
        <div className="bat right medium" style={{ top: '85%', animationDelay: '3s', animationDuration: '21s' }}></div>

        {/* Background bats (small, slower, blurred) */}
        <div className="bat left small" style={{ top: '5%', animationDelay: '12s', animationDuration: '25s' }}></div>
        <div className="bat right small" style={{ top: '25%', animationDelay: '15s', animationDuration: '28s' }}></div>
        <div className="bat left small" style={{ top: '50%', animationDelay: '10s', animationDuration: '26s' }}></div>
        <div className="bat right small" style={{ top: '70%', animationDelay: '18s', animationDuration: '30s' }}></div>
        <div className="bat left tiny" style={{ top: '90%', animationDelay: '20s', animationDuration: '35s' }}></div>
      </div>
      {/* ------------------------------- */}

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
                جوائز و هدايا كل شهر مع منصة <span className="text-highlight">Khofach</span>. 
                اشحن حسابك في 30 ثانية واستفد من أسرع خدمة في المغرب.
              </p>
              
              <div className="btn-group">
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
                 src={Promoimage}
                 alt="Code Promo" 
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

      {/* Platforms Footer (UPDATED WITH LINKS) */}
      <div className="platforms-section relative z-10">
        <div className="container text-center">
          <span className="payment-title" style={{color: '#666', fontSize: '0.9rem'}}>المنصات المدعومة</span>
          <div className="logos-row grayscale-hover">
            
            {/* 1XBET LINK */}
            <a href="https://refpa58144.com/L?tag=d_4835273m_1573c_&site=4835273&ad=1573" target="_blank" rel="noopener noreferrer">
              <img src={xbetImg} alt="1xBet" className="platform-logo cursor-pointer" />
            </a>

            {/* MELBET LINK */}
            <a href="https://melbet-ma.com/en?tag=d_4843377m_45415c_" target="_blank" rel="noopener noreferrer">
              <img src={melbetImg} alt="Melbet" className="platform-logo cursor-pointer" />
            </a>

            {/* LINEBET LINK */}
            <a href="https://lb-aff.com/L?tag=d_4842780m_22611c_site&site=4842780&ad=22611&r=registration" target="_blank" rel="noopener noreferrer">
              <img src={linebetImg} alt="Linebet" className="platform-logo cursor-pointer" />
            </a>

          </div>
        </div>
      </div>

    </div>
  );
}