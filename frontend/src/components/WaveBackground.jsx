// WaveBackground.js
import React from 'react';

const WaveBackground = () => {
  return (
    <div className="w-full h-full overflow-hidden relative">
      <svg
        className="absolute bottom-0 left-0 w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ height: '100%', width: '100%' }} // Ensure SVG fills its container
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor: "#60A5FA", stopOpacity: 1}} /> {/* Blue-400 */}
            <stop offset="100%" style={{stopColor: "#3B82F6", stopOpacity: 1}} /> {/* Blue-500 */}
          </linearGradient>
        </defs>
        <path
          fill="url(#waveGradient)"
          fillOpacity="0.8"
          d="M0,192L48,197.3C96,203,192,213,288,218.7C384,224,480,224,576,218.7C672,213,768,203,864,197.3C960,192,1056,192,1152,192C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        >
          {/* A simple wave animation. For more complex/dynamic waves, you might use:
              - CSS animations on the path's 'transform' property
              - JavaScript to dynamically update path 'd' attribute
              - A library like react-wavify or react-water-wave
          */}
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="
              M0,192L48,197.3C96,203,192,213,288,218.7C384,224,480,224,576,218.7C672,213,768,203,864,197.3C960,192,1056,192,1152,192C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
              M0,224L48,218.7C96,213,192,203,288,208C384,213,480,229,576,234.7C672,240,768,235,864,224C960,213,1056,192,1152,192C1248,192,1344,197,1392,192L1440,187L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
              M0,192L48,197.3C96,203,192,213,288,218.7C384,224,480,224,576,218.7C672,213,768,203,864,197.3C960,192,1056,192,1152,192C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
            "
          />
        </path>
      </svg>
    </div>
  );
};

export default WaveBackground;