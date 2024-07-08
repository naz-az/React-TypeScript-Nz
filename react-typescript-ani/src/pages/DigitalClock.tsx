import React, { useEffect, useState } from 'react';
import './DigitalClock.css'; 
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface FlowRate {
  time: Date;
  value: number;
}

const FlowMeter: React.FC = () => {
  const [flowRate, setFlowRate] = useState({
    whole: '00',
    fractional: '00',
    unit: 'm/s',
  });
  const [flowHistory, setFlowHistory] = useState<FlowRate[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateFlowRate = () => {
      const flowValue = (Math.random() * 100).toFixed(2); // Simulated flow rate reading
      const [whole, fractional] = flowValue.split('.');
      
      setFlowRate({
        whole: whole.padStart(2, '0'),
        fractional: fractional.padStart(2, '0'),
        unit: 'm/s',
      });

      setFlowHistory((prevHistory) => {
        const now = new Date();
        const newHistory = [
          ...prevHistory,
          { time: now, value: parseFloat(flowValue) }
        ];

        // Keep only the data points from the last 5 seconds
        return newHistory.filter(entry => (now.getTime() - entry.time.getTime()) <= 10000);
      });
    };

    const intervalId = setInterval(updateFlowRate, 1000); // Update every second
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="digital-clock">
        <div className="time">
          <span className="hours">{flowRate.whole}</span>
          <span className="dots">.</span>
          <span className="minutes">{flowRate.fractional}</span>
          <div className="right-side">
            <span className="period">{flowRate.unit}</span>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Flow History</h3>
        <div className="h-64 w-full border border-gray-300" style={{ minHeight: '256px' }}>
          {flowHistory.length > 0 ? (
            <>
              <h4 className="text-lg font-semibold mb-2 mt-4">Recharts Chart:</h4>
              <ResponsiveContainer width="100%" height={200}>
                {error ? (
                  <div>Error rendering chart: {error}</div>
                ) : (
                  <LineChart data={flowHistory}>
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={(time) => new Date(time).toLocaleTimeString()} 
                    />
                    <YAxis />
                    <Tooltip labelFormatter={(time) => new Date(time).toLocaleTimeString()} />
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
    </>
  );
};

export default FlowMeter;
