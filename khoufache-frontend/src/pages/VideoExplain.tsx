import { PlayCircle } from 'lucide-react';
import './VideoExplain.css'; // <--- ADD THIS LINE

export default function VideoExplain() {
  return (
    <div className="video-page" dir="rtl">
      <div className="container text-center">
        
        <div className="video-header">
          <h1>
            شرح طريقة <span className="text-highlight">السحب والإيداع</span>
          </h1>
          <p>
            شاهد هذا الفيديو القصير لتعرف كيف تقوم بشحن حسابك أو سحب أرباحك في ثواني عبر منصة Khoufache.
          </p>
        </div>

        {/* Video Player Container */}
        <div className="video-container-wrapper">
          <div className="video-player-card group">
            
            {/* Play Button Overlay */}
            <div className="video-overlay">
              <div className="play-button-glow">
                <PlayCircle size={48} className="text-white" />
              </div>
            </div>
            
            {/* Background Placeholder Image */}
            <img 
              src="https://placehold.co/800x450/111/white?text=Video+Tutorial" 
              alt="Video Tutorial" 
              className="video-placeholder-img" 
            />
            
            {/* Replace the img above with this iframe when you have a link: */}
            {/* <iframe className="actual-video" src="https://www.youtube.com/embed/YOUR_ID" allowFullScreen></iframe> */}
          </div>
        </div>

      </div>
    </div>
  );
}