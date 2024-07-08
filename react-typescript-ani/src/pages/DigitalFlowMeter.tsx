import React, { useState, useEffect } from 'react';
import { Gauge } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomChart: React.FC<{ data: { value: number }[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 20);
  const height = 200;
  const width = 300;

  return (
    <svg width={width} height={height}>
      {data.map((d, i) => (
        <rect
          key={i}
          x={i * (width / data.length)}
          y={height - (d.value / maxValue) * height}
          width={width / data.length - 1}
          height={(d.value / maxValue) * height}
          fill="blue"
        />
      ))}
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
        const newFlowRate = Math.random() * 10 + 5;
        setFlowRate(Number(newFlowRate.toFixed(2)));
        setFlowHistory(prev => {
          const newHistory = [
            ...prev,
            { time: new Date().toLocaleTimeString(), value: newFlowRate }
          ].slice(-20);
          console.log('Current flow history:', newHistory);
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
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6 mb-4">
        <h2 className="text-2xl font-bold text-center mb-4">Digital Flow Meter</h2>
        <div className="flex items-center justify-center mb-4">
          <Gauge size={100} className={`text-blue-500 ${isFlowing ? 'animate-pulse' : ''}`} />
          <div className="ml-4">
            <p className="text-4xl font-bold">{flowRate.toFixed(2)}</p>
            <p className="text-gray-500">Liters per second</p>
          </div>
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
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
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
      <div className="mt-4">
        <h4 className="font-bold">Debugging Info:</h4>
        <p>Is Flowing: {isFlowing.toString()}</p>
        <p>Flow History Length: {flowHistory.length}</p>
        <p>Latest Flow Rate: {flowHistory[flowHistory.length - 1]?.value.toFixed(2) || 'N/A'}</p>
      </div>
    </div>
  );
};

export default DigitalFlowMeter;