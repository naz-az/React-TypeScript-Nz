import { useState, useEffect } from 'react';

const ZigzagPipe: React.FC = () => {
  const [flowPercentage, setFlowPercentage] = useState<number>(0);
  const [isFlowing, setIsFlowing] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);

  useEffect(() => {
    let timer: number | undefined;
    if (isFlowing && flowPercentage < 100) {
      timer = window.setInterval(() => {
        setFlowPercentage(prev => Math.min(prev + 1, 100));
      }, 50);
    } else if (isRemoving && flowPercentage > 0) {
      timer = window.setInterval(() => {
        setFlowPercentage(prev => Math.max(prev - 1, 0));
      }, 50);
    }
    return () => {
      if (timer !== undefined) {
        window.clearInterval(timer);
      }
    };
  }, [isFlowing, isRemoving, flowPercentage]);

  const handleStartFlow = () => {
    if (isRemoving) {
      setIsRemoving(false);
    }
    setIsFlowing(prev => !prev);
  };

  const handleRemoveFlow = () => {
    if (isFlowing) {
      setIsFlowing(false);
    }
    setIsRemoving(prev => !prev);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-md">
      <svg width="100%" height="80px" viewBox="0 0 400 60" className="mb-4">
        <path
          d="M0 45 L40 15 L80 45 L120 15 L160 45 L200 15 L240 45 L280 15 L320 45 L360 15 L400 45"
          fill="transparent"
          stroke="#2c3e50"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <defs>
          <mask id="waterMask">
            <rect x="0" y="0" width={`${400 * (flowPercentage / 100)}`} height="60" fill="white" />
          </mask>
        </defs>
        <path
          d="M0 45 L40 15 L80 45 L120 15 L160 45 L200 15 L240 45 L280 15 L320 45 L360 15 L400 45"
          fill="transparent"
          stroke="#3498db"
          strokeWidth="8"
          mask="url(#waterMask)"
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-20"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </svg>

      <div className="flex items-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mr-2">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
        <span className="text-lg font-semibold">{flowPercentage}%</span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={flowPercentage}
        onChange={(e) => setFlowPercentage(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-4"
      />

      <div className="flex space-x-4">
        <button
          onClick={handleStartFlow}
          disabled={flowPercentage === 100}
          className={`px-4 py-2 rounded-full font-semibold text-white ${
            isFlowing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
          } transition-colors ${flowPercentage === 100 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isFlowing ? 'Pause Flow' : 'Start Flow'}
        </button>

        <button
          onClick={handleRemoveFlow}
          disabled={flowPercentage === 0}
          className={`px-4 py-2 rounded-full font-semibold text-white ${
            isRemoving ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'
          } transition-colors ${flowPercentage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isRemoving ? 'Pause Removal' : 'Remove Flow'}
        </button>
      </div>
    </div>
  );
};

export default ZigzagPipe;