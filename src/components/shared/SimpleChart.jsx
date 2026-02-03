import React from 'react';

export default function SimpleChart({ labels = [], values = [], height = 180 }) {
  const max = Math.max(...values, 1);
  const barWidth = labels.length ? Math.max(10, Math.floor(100 / labels.length)) : 10;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="w-full h-44">
        {values.map((v, i) => {
          const x = (i * (100 / values.length)) + 2;
          const barW = (100 / values.length) - 4;
          const h = (v / max) * (height - 30);
          const y = height - h - 20;
          return (
            <g key={i}>
              <rect x={`${x}%`} y={y} width={`${barW}%`} height={h} rx="2" fill="#4f46e5" />
              <text x={`${x + barW / 2}%`} y={height - 6} fontSize="3" textAnchor="middle" fill="#374151">{labels[i]}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
