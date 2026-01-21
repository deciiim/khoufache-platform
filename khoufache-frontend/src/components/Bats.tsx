import React from 'react';
import './Bats.css';

export default function Bats() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div className="bat fly-right-1"></div>
      <div className="bat fly-left-1"></div>
      <div className="bat fly-right-2"></div>
    </div>
  );
}