'use client';
import React from 'react';

const AnimatedCard = () => {
  const handleResumeClick = () => {
    window.open('https://your-resume-link.com', '_blank'); // Replace with actual resume URL
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card">
        <svg 
          height="100%" 
          width="100%" 
          className="border" 
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 320"
        >
          <line x1="0" y1="0" x2="200" y2="0" className="top" />
          <line x1="0" y1="0" x2="0" y2="320" className="left" />
          <line x1="0" y1="320" x2="200" y2="320" className="bottom" />
          <line x1="200" y1="0" x2="200" y2="320" className="right" />
        </svg>

        <div className="info">
          <h2 className="name">Bhavik Balpande</h2>
          <p className="title">MERN Stack Developer</p>
          <div className="links">
            <a href="https://www.linkedin.com/in/bhavik-balpande/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/Bhavik0203" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
         
        </div>
      </div>

      <style jsx>{`
        .card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 200px;
          height: 320px;
          background: #C6C6D0;
          color: #212121;
          box-shadow: inset 0 0 0 4px #212121;
          transition: .6s 0.4s;
          cursor: pointer;
          padding: 1rem;
          text-align: center;
        }

        .border {
          position: absolute;
          inset: 0;
        }

        .border line {
          stroke-width: 4px;
          stroke: #C6C6D0;
          fill: none;
          transition: .6s ease-in-out;
        }

        .border line.top,
        .border line.bottom {
          stroke-dasharray: 200;
        }

        .border line.left,
        .border line.right {
          stroke-dasharray: 320;
        }

        .info {
          z-index: 10;
        }

        .name {
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .title {
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .links {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 1rem;
        }

        .links a {
          color: #212121;
          text-decoration: underline;
          font-size: 0.85rem;
        }

        button {
          background-color: #212121;
          color: #C6C6D0;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: background 0.3s;
        }

        button:hover {
          background-color: #000;
        }

        .card:hover {
          background-color: transparent;
          transition-delay: 0s;
        }

        .card:hover .border line {
          transition-delay: 0.1s;
        }

        .card:hover .border line.top {
          transform: translateX(-200px);
        }

        .card:hover .border line.bottom {
          transform: translateX(200px);
        }

        .card:hover .border line.left {
          transform: translateY(-320px);
        }

        .card:hover .border line.right {
          transform: translateY(320px);
        }
      `}</style>
    </div>
  );
};

export default AnimatedCard;
