import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const RealisticFlowMeter: React.FC<{ flowRate: number }> = ({ flowRate }) => {
  const maxFlow = 20;
  const angle = (flowRate / maxFlow) * 270 - 135; // -135 to 135 degrees

  return (
    <svg width="200" height="200" viewBox="0 0 400 400">
      <defs>
        <linearGradient id="dialGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="50%" stopColor="#3a3a3a" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
        <radialGradient id="rimGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="80%" stopColor="#666" />
          <stop offset="95%" stopColor="#999" />
          <stop offset="100%" stopColor="#666" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer rim */}
      <circle cx="200" cy="200" r="190" fill="url(#rimGradient)" />
      
      {/* Inner dial */}
      <circle cx="200" cy="200" r="180" fill="url(#dialGradient)" />
      
      {/* Tick marks */}
      {[...Array(21)].map((_, i) => {
        const tickAngle = -135 + i * 13.5;
        const isMajor = i % 5 === 0;
        return (
          <line
            key={i}
            x1={200 + (isMajor ? 140 : 150) * Math.cos(tickAngle * Math.PI / 180)}
            y1={200 + (isMajor ? 140 : 150) * Math.sin(tickAngle * Math.PI / 180)}
            x2={200 + 170 * Math.cos(tickAngle * Math.PI / 180)}
            y2={200 + 170 * Math.sin(tickAngle * Math.PI / 180)}
            stroke={isMajor ? "#39f5ff" : "#39f5ff99"}
            strokeWidth={isMajor ? 3 : 1}
          />
        );
      })}
      
      {/* Labels */}
      {[0, 5, 10, 15, 20].map((value, i) => {
        const labelAngle = -135 + i * 67.5;
        return (
          <text
            key={value}
            x={200 + 130 * Math.cos(labelAngle * Math.PI / 180)}
            y={200 + 130 * Math.sin(labelAngle * Math.PI / 180)}
            fill="#39f5ff"
            fontSize="16"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {value}
          </text>
        );
      })}
      
      {/* Needle */}
      <g transform={`rotate(${angle}, 200, 200)`}>
        <path d="M197 50 L200 30 L203 50 L200 190 Z" fill="#ff3939" />
        <circle cx="200" cy="200" r="15" fill="#ff3939" />
      </g>
      
      {/* Center cap */}
      <circle cx="200" cy="200" r="10" fill="#888" />
      <circle cx="200" cy="200" r="8" fill="#666" />
      
      {/* Digital readout */}
      <rect x="150" y="280" width="100" height="40" rx="5" ry="5" fill="#000" />
      <text x="200" y="308" textAnchor="middle" fill="#39f5ff" fontSize="24" fontWeight="bold" filter="url(#glow)">
        {flowRate.toFixed(1)}
      </text>
      
      {/* Label */}
      <text x="200" y="340" textAnchor="middle" fill="#39f5ff" fontSize="14">
        FLOW RATE L/S
      </text>
    </svg>
  );
};

const DigitalFlowMeter: React.FC = () => {
  const [flowRate, setFlowRate] = useState(0);
  const [flowHistory, setFlowHistory] = useState<{ time: string; value: number }[]>([]);
  const [isFlowing, setIsFlowing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: number | undefined;
    if (isFlowing) {
      interval = window.setInterval(() => {
        const newFlowRate = Math.random() * 20;
        setFlowRate(Number(newFlowRate.toFixed(1)));
        setFlowHistory(prev => {
          const newHistory = [
            ...prev,
            { time: new Date().toLocaleTimeString(), value: newFlowRate }
          ].slice(-20);
          return newHistory;
        });
      }, 1000);
    }
    return () => {
      if (interval !== undefined) {
        window.clearInterval(interval);
      }
    };
  }, [isFlowing]);

  const toggleFlow = () => setIsFlowing(!isFlowing);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFlowRate(Number(event.target.value));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-gray-900">
      <div className="bg-black shadow-lg rounded-lg p-6 mb-4">
        <h2 className="text-2xl font-bold text-center mb-4 text-cyan-400">Digital Flow Meter</h2>
        <div className="flex items-center justify-center mb-4">
          <RealisticFlowMeter flowRate={flowRate} />
        </div>
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max="20"
            step="0.1"
            value={flowRate}
            onChange={handleSliderChange}
            disabled={isFlowing}
            className="w-full"
          />
        </div>
        <button
          onClick={toggleFlow}
          className="w-full bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700 transition-colors"
        >
          {isFlowing ? 'Stop Flow' : 'Start Flow'}
        </button>
      </div>
    <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Flow History</h3>
        <div className="h-64 w-full border border-gray-300" style={{ minHeight: '256px' }}>
          {flowHistory.length > 0 ? (
            <>
              {/* <h4 className="text-lg font-semibold mb-2">Custom Chart:</h4>
              <CustomChart data={flowHistory} /> */}
              <h4 className="text-lg font-semibold mb-2 mt-4">Recharts Chart:</h4>
              <ResponsiveContainer width="100%" height={200}>
                {error ? (
                  <div>Error rendering chart: {error}</div>
                ) : (
                  <LineChart data={flowHistory}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </>
          ) : (
            <p>No flow history data available. Start the flow to see the graph.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default DigitalFlowMeter;