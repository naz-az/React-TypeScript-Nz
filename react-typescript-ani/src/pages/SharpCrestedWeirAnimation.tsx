import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

const SharpCrestedWeirAnimation: React.FC = () => {
  const [leftWaterLevel, setLeftWaterLevel] = useState<number>(100);
  const [rightWaterLevel] = useState<number>(50);
  const [waterPresent, setWaterPresent] = useState<boolean>(false);
  const [waterPosition, setWaterPosition] = useState<number>(0);
  const [flowSpeed, setFlowSpeed] = useState<number>(0.1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const weirPosition = 250;
  const weirHeight = 140;
  const weirWidth = 10;
  const waterfallWidth = 80;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastUpdateTime = 0;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw sharp-crested weir
      ctx.fillStyle = '#888';
      ctx.fillRect(weirPosition, canvas.height - weirHeight, weirWidth, weirHeight);

      if (waterPresent) {
        // Create water gradient
        const gradient = ctx.createLinearGradient(0, canvas.height - weirHeight, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 120, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 20, 170, 0.9)');

        ctx.fillStyle = gradient;
        ctx.beginPath();

        // Left side of the weir
        ctx.moveTo(0, canvas.height - leftWaterLevel);
        for (let x = 0; x < Math.min(waterPosition, weirPosition); x++) {
          let y = canvas.height - leftWaterLevel;
          y += 3 * Math.sin((canvas.width - x) / 30 - time / 300)
            + 2 * Math.sin((canvas.width - x) / 20 - time / 200)
            + 1 * Math.sin((canvas.width - x) / 10 - time / 100);
          ctx.lineTo(x, y);
        }







        // Waterfall effect
        if (waterPosition > weirPosition && leftWaterLevel > weirHeight) {
          const fallStart = canvas.height - leftWaterLevel;
          const fallEnd = canvas.height - rightWaterLevel;
          
          // Calculate how much of the waterfall to draw
          const waterfallProgress = Math.min((waterPosition - weirPosition) / waterfallWidth, 1);
          
          ctx.lineTo(weirPosition, fallStart);
          
          const numPoints = 20;
          
          for (let i = 1; i <= numPoints; i++) {
            const t = i / numPoints;
            if (t > waterfallProgress) break;
            
            const x = weirPosition + waterfallWidth * t;
            const y = fallStart + (fallEnd - fallStart) * t * t; // Quadratic curve for more natural fall
            
            // Add waviness
            const waviness = 5 * Math.sin(t * Math.PI * 2 + time / 100) 
                           + 3 * Math.sin(t * Math.PI * 4 + time / 50);
            
            ctx.lineTo(x, y + waviness);
          }

          // Air cavity (always present, but size depends on waterfall progress)
          const cavityDepth =  1*waterfallProgress;
          ctx.lineTo(weirPosition + waterfallWidth * waterfallProgress, canvas.height - rightWaterLevel + cavityDepth +40);
          ctx.quadraticCurveTo(
            weirPosition + (waterfallWidth * waterfallProgress) / 2, (canvas.height - weirHeight + cavityDepth * 2) -10,
            weirPosition, canvas.height - weirHeight + cavityDepth
          );
          ctx.lineTo(weirPosition+10, fallStart);
        } else if (waterPosition > weirPosition) {
          ctx.lineTo(weirPosition, canvas.height - Math.min(leftWaterLevel, weirHeight));
        }



        // Right side of the weir
        if (waterPosition > weirPosition) {
          for (let x = weirPosition + weirWidth; x < waterPosition; x++) {
            let y = canvas.height - rightWaterLevel;
            y += 3 * Math.sin((canvas.width - x) / 30 - time / 300)
              + 2 * Math.sin((canvas.width - x) / 20 - time / 200)
              + 1 * Math.sin((canvas.width - x) / 10 - time / 100);
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(waterPosition, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();

        // Add a subtle highlight on the water surface
        ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - leftWaterLevel);
        for (let x = 0; x < waterPosition; x++) {
          let y;
          if (x < weirPosition) {
            y = canvas.height - leftWaterLevel;
          } else {
            y = canvas.height - rightWaterLevel;
          }
          y += 3 * Math.sin((canvas.width - x) / 30 - time / 300)
            + 2 * Math.sin((canvas.width - x) / 20 - time / 200)
            + 1 * Math.sin((canvas.width - x) / 10 - time / 100);
          ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Progress the water flow based on flowSpeed
        if (waterPosition < canvas.width && time - lastUpdateTime > 16) { // 60 FPS
          setWaterPosition(prev => Math.min(prev + flowSpeed, canvas.width));
          lastUpdateTime = time;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [leftWaterLevel, rightWaterLevel, waterPresent, waterPosition, flowSpeed]);

  const handleLeftWaterLevelChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLeftWaterLevel(Number(e.target.value));
  };

  const handleFlowSpeedChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFlowSpeed(Number(e.target.value));
  };

  const handleIntroduceWater = () => {
    setWaterPresent(true);
    setWaterPosition(0);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Sharp-Crested Weir Animation</h2>
      <div className="mb-4">
        <label htmlFor="left-water-level-input" className="block mb-2">Left Water Level:</label>
        <input
          id="left-water-level-input"
          type="number"
          value={leftWaterLevel}
          onChange={handleLeftWaterLevelChange}
          className="w-24 p-1 border rounded"
        />
        
        <div className="mt-4">
          <label htmlFor="right-water-level-input" className="block mb-2">Right Water Level (Fixed):</label>
          <input
            id="right-water-level-input"
            type="number"
            value={rightWaterLevel}
            readOnly
            className="w-24 p-1 border rounded bg-gray-100"
          />
        </div>
        
        <div className="mt-4">
          <label htmlFor="flow-speed-input" className="block mb-2">Flow Speed:</label>
          <input
            id="flow-speed-input"
            type="range"
            min="0.01"
            max="1"
            step="0.01"
            value={flowSpeed}
            onChange={handleFlowSpeedChange}
            className="w-full"
          />
          <span>{flowSpeed.toFixed(2)}</span>
        </div>
        
        <div className="mt-4">
          <button
            onClick={handleIntroduceWater}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={waterPresent}
          >
            Introduce Water
          </button>
        </div>
      </div>

      <canvas 
        ref={canvasRef}
        width={500}
        height={300}
        className="w-full h-auto border border-gray-300"
      />
    </div>
  );
};

export default SharpCrestedWeirAnimation;