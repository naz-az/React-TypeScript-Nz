import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

  const pipePath = "M0,50 V10 H80 V90 H160 V10 H240 V90 H320 V10 H400 V50";

  return (
    <div className="flex flex-col items-center p-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl shadow-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <svg width="100%" height="120px" viewBox="0 0 400 120" className="mb-6">
          {/* Background glow effect */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Outer path of the pipe */}
          <path
            d={pipePath}
            fill="transparent"
            stroke="url(#pipeGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />
          
          {/* Gradient for the pipe */}
          <linearGradient id="pipeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4A90E2" />
            <stop offset="100%" stopColor="#9B59B6" />
          </linearGradient>
          
          {/* Mask definition for water */}
          <defs>
            <mask id="waterMask">
              <rect x="0" y="0" width={`${400 * (flowPercentage / 100)}`} height="120" fill="white" />
            </mask>
          </defs>
          
          {/* Inner path for water, using mask */}
          <path
            d={pipePath}
            fill="transparent"
            stroke="url(#waterGradient)"
            strokeWidth="10"
            mask="url(#waterMask)"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1s" repeatCount="indefinite" />
          </path>
          
          {/* Gradient for the water */}
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1E3A8A">
              <animate attributeName="stop-color" values="#1E3A8A; #2563EB; #1E3A8A" dur="4s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#1E40AF">
              <animate attributeName="stop-color" values="#1E40AF; #3B82F6; #1E40AF" dur="4s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </svg>

        <motion.div 
          className="flex items-center justify-center mb-6"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mr-3">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            {flowPercentage}%
          </span>
        </motion.div>

        <motion.input
          type="range"
          min="0"
          max="100"
          value={flowPercentage}
          onChange={(e) => setFlowPercentage(parseInt(e.target.value))}
          className="w-full h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer mb-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        />

        <div className="flex justify-center space-x-4">
          <motion.button
            onClick={handleStartFlow}
            disabled={flowPercentage === 100}
            className={`px-6 py-3 rounded-full font-bold text-white shadow-lg ${
              isFlowing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
            } transition-colors ${flowPercentage === 100 ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isFlowing ? 'Pause Flow' : 'Start Flow'}
          </motion.button>

          <motion.button
            onClick={handleRemoveFlow}
            disabled={flowPercentage === 0}
            className={`px-6 py-3 rounded-full font-bold text-white shadow-lg ${
              isRemoving ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'
            } transition-colors ${flowPercentage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRemoving ? 'Pause Removal' : 'Remove Flow'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ZigzagPipe;