import { PlayCircle } from 'lucide-react';
import videoSource from '../assets/tutorial.mp4'; // <--- Import your video here
import './VideoExplain.css';

export default function VideoExplain() {
  return (
    <div className="video-page" dir="rtl">
      <div className="container text-center">
        
        <div className="video-header">
          <h1>
            شرح طريقة <span className="text-highlight">السحب والإيداع</span>
          </h1>
          <p>
            شاهد هذا الفيديو القصير لتعرف كيف تقوم بسحب أرباحك في ثواني عبر منصة Khoufache.
          </p>
        </div>

        {/* Video Player Container */}
        <div className="video-container-wrapper">
          <div className="video-player-card group">
            
            <video 
              controls 
              className="actual-video"
              poster="https://placehold.co/800x450/111/FFD700?text=Khofach+tutorial" // Optional thumbnail
            >
              <source src={videoSource} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

          </div>
        </div>

      </div>
    </div>
  );
}