import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

const SharpCrestedWeirAnimation3: React.FC = () => {
  const initialLeftWaterLevel = 160;
  const initialRightWaterLevel = 50;

  const [leftWaterLevel, setLeftWaterLevel] = useState<number>(initialLeftWaterLevel);
  const [rightWaterLevel, setRightWaterLevel] = useState<number>(initialRightWaterLevel);
  const [waterPresent, setWaterPresent] = useState<boolean>(false);
  const [waterPosition, setWaterPosition] = useState<number>(0);
  const [flowSpeed, setFlowSpeed] = useState<number>(0.9);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [numberOfGauges, setNumberOfGauges] = useState<number>(1);
  const [gaugePositions, setGaugePositions] = useState<number[]>([0.25, 0.75]);
  const [isDraining, setIsDraining] = useState<boolean>(false);
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
          
          const waterfallProgress = Math.min((waterPosition - weirPosition) / waterfallWidth, 1);
          
          ctx.lineTo(weirPosition, fallStart);
          
          const numPoints = 20;
          
          for (let i = 1; i <= numPoints; i++) {
            const t = i / numPoints;
            if (t > waterfallProgress) break;
            
            const x = weirPosition + waterfallWidth * t;
            const y = fallStart + (fallEnd - fallStart) * t * t;
            
            const waviness = 2 * Math.sin(t * Math.PI * 2 + time / 100) 
                           + 1 * Math.sin(t * Math.PI * 4 + time / 50);
            
            ctx.lineTo(x, y + waviness);
          }

          const cavityDepth = 1 * waterfallProgress;
          ctx.lineTo(weirPosition + waterfallWidth * waterfallProgress, canvas.height - rightWaterLevel + cavityDepth + 40);
          ctx.quadraticCurveTo(
            weirPosition + (waterfallWidth * waterfallProgress) / 2, (canvas.height - weirHeight + cavityDepth * 2) - 10,
            weirPosition, canvas.height - weirHeight + cavityDepth
          );
          ctx.lineTo(weirPosition, fallStart);
        } else if (waterPosition > weirPosition) {
          ctx.lineTo(weirPosition, canvas.height - Math.min(leftWaterLevel, weirHeight));
        }

        // Right side of the weir
        if (waterPosition > weirPosition) {
          for (let x = weirPosition + weirWidth-10; x < waterPosition; x++) {
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

        // Progress the water flow based on flowSpeed if not paused
        if (!isPaused && waterPosition < canvas.width && time - lastUpdateTime > 16) {
          setWaterPosition(prev => Math.min(prev + flowSpeed, canvas.width));
          lastUpdateTime = time;
        }

        // Drain water if draining is active
        if (isDraining && time - lastUpdateTime > 16) {
          setLeftWaterLevel(prev => Math.max(prev - 0.5, 0));
          setRightWaterLevel(prev => Math.max(prev - 0.5, 0));
          if (leftWaterLevel <= 0 && rightWaterLevel <= 0) {
            resetWaterState();
          }
          lastUpdateTime = time;
        }
      }

      // Draw level gauges
      gaugePositions.slice(0, numberOfGauges).forEach((position, index) => {
        const gaugeX = position * canvas.width;
        const gaugeTop = canvas.height * 0.25;
        const gaugeBottom = canvas.height;

        // Draw main gauge line
        ctx.strokeStyle = index === 0 ? 'olive' : 'purple';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(gaugeX, gaugeBottom);
        ctx.lineTo(gaugeX, gaugeTop);
        ctx.stroke();

        // Draw Vernier scale marks
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        const numMarks = 1;
        for (let i = 0; i <= numMarks; i++) {
          const y = gaugeBottom - (i / numMarks) * (gaugeBottom - gaugeTop);
          ctx.beginPath();
          ctx.moveTo(gaugeX - 10, y);
          ctx.lineTo(gaugeX + 10, y);
          ctx.stroke();
        }
      });

            // Draw sharp-crested weir
            ctx.fillStyle = '#888';
            ctx.fillRect(weirPosition, canvas.height - weirHeight, weirWidth, weirHeight);
      

      animationFrameId = requestAnimationFrame(draw);
    };

    draw(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [leftWaterLevel, rightWaterLevel, waterPresent, waterPosition, flowSpeed, isPaused, numberOfGauges, gaugePositions, isDraining]);

  const resetWaterState = () => {
    setWaterPresent(false);
    setIsDraining(false);
    setIsPaused(false);
    setWaterPosition(0);
    setLeftWaterLevel(initialLeftWaterLevel);
    setRightWaterLevel(initialRightWaterLevel);
  };

  const handleLeftWaterLevelChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLeftWaterLevel(Number(e.target.value));
  };

  const handleFlowSpeedChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFlowSpeed(Number(e.target.value));
  };

  const handleWaterToggle = () => {
    if (!waterPresent) {
      setWaterPresent(true);
      setWaterPosition(0);
      setIsPaused(false);
      setLeftWaterLevel(initialLeftWaterLevel);
      setRightWaterLevel(initialRightWaterLevel);
    } else {
      setIsPaused(!isPaused);
    }
  };

  const handleNumberOfGaugesChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setNumberOfGauges(Number(e.target.value));
  };

  const handleGaugePositionChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    setGaugePositions(prev => {
      const newPositions = [...prev];
      newPositions[index] = Number(e.target.value);
      return newPositions;
    });
  };

  const handleDrainWater = () => {
    setIsDraining(true);
    setIsPaused(true);
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
        
        {/* <div className="mt-4">
          <label htmlFor="right-water-level-input" className="block mb-2">Right Water Level (Fixed):</label>
          <input
            id="right-water-level-input"
            type="number"
            value={rightWaterLevel}
            readOnly
            className="w-24 p-1 border rounded bg-gray-100"
          />
        </div> */}
        
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
          <label htmlFor="number-of-gauges" className="block mb-2">Number of Gauges:</label>
          <select
            id="number-of-gauges"
            value={numberOfGauges}
            onChange={handleNumberOfGaugesChange}
            className="w-24 p-1 border rounded"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </div>

        {[...Array(numberOfGauges)].map((_, index) => (
          <div key={index} className="mt-4">
            <label htmlFor={`gauge-position-${index}`} className="block mb-2">Level Gauge {index + 1} Position:</label>
            <input
              id={`gauge-position-${index}`}
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={gaugePositions[index]}
              onChange={handleGaugePositionChange(index)}
              className="w-full"
            />
            <output className="block p-2 border rounded">
              {(gaugePositions[index] * 100).toFixed(0)} %
            </output>
          </div>
        ))}
        
        <div className="mt-4 flex space-x-4">
          <button
            onClick={handleWaterToggle}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {!waterPresent ? "Introduce Water" : (isPaused ? "Resume Water" : "Pause Water")}
          </button>
          <button
            onClick={handleDrainWater}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            disabled={!waterPresent || isDraining}
          >
            Drain Water
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

export default SharpCrestedWeirAnimation3;