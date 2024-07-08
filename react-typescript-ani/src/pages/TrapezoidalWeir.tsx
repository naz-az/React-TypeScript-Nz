
  import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

  const TrapezoidalWeir: React.FC = () => {
    const [leftWaterHeight, setLeftWaterHeight] = useState<number>(70);
    const [waterPresent, setWaterPresent] = useState<boolean>(false);
    const [animationProgress, setAnimationProgress] = useState<number>(0);
    const [gaugePositions, setGaugePositions] = useState<number[]>([0, 0]);
    const [isDraining, setIsDraining] = useState<boolean>(false);
    const [drainProgress, setDrainProgress] = useState<number>(0);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [numberOfGauges, setNumberOfGauges] = useState<number>(1);
    const canvasRef = useRef<HTMLCanvasElement>(null);
  
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
  
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
  
      let animationFrameId: number;
  
      const draw = (time: number) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
// Define dimensions for the trapezoidal weir
const weirHeight = 40;
const weirTopWidth = 60;
const weirBaseWidth = 140;
const weirCenterX = canvas.width / 2;
const weirY = canvas.height - weirHeight;

// Calculate the coordinates for the trapezoid
const leftTopX = weirCenterX - weirTopWidth / 2;
const rightTopX = weirCenterX + weirTopWidth / 2;
const leftBaseX = weirCenterX - weirBaseWidth / 2;
const rightBaseX = weirCenterX + weirBaseWidth / 2;

// Draw the trapezoidal weir
ctx.fillStyle = 'orange';
ctx.beginPath();
ctx.moveTo(leftBaseX, canvas.height);
ctx.lineTo(leftTopX, weirY);
ctx.lineTo(rightTopX, weirY);
ctx.lineTo(rightBaseX, canvas.height);
ctx.closePath();
ctx.fill();

  
        if (waterPresent) {
          // Create water gradient
          const gradient = ctx.createLinearGradient(0, canvas.height - 120, 0, canvas.height);
          gradient.addColorStop(0, 'rgba(0, 120, 255, 0.8)');
          gradient.addColorStop(1, 'rgba(0, 20, 170, 0.9)');
  
          // Start clipping path
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, canvas.width, canvas.height);
          ctx.moveTo(leftBaseX, canvas.height);
          ctx.lineTo(leftTopX, weirY);
          ctx.lineTo(rightTopX, weirY);
          ctx.lineTo(rightBaseX, canvas.height);
          ctx.closePath();
          ctx.clip('evenodd');
  
          // Draw water
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(0, canvas.height - leftWaterHeight);
  
          const rightWaterHeight = leftWaterHeight * 0.2; // 30% less than left water height
          const transitionStartX = ((leftBaseX + rightBaseX) / 2); // Start transition at the middle of the weir
        const transitionEndX = rightBaseX + (rightBaseX - leftBaseX) / 4; // End transition after the weir

          let maxWaterHeight = 0;
  
          for (let x = 0; x < canvas.width * animationProgress; x++) {
            let y = canvas.height - leftWaterHeight;
      
            // Smooth transition over the weir
            if (x > transitionStartX && x < transitionEndX) {
              const progress = (x - transitionStartX) / (transitionEndX - transitionStartX);
              
              // Calculate the weir profile
              const weirProfile = x < weirCenterX
                ? weirY + (canvas.height - weirY) * (1 - (x - leftBaseX) / (weirCenterX - leftBaseX))
                : weirY + (canvas.height - weirY) * ((x - weirCenterX) / (rightBaseX - weirCenterX));
      
              // Calculate water height based on a smooth curve
              const curveHeight = leftWaterHeight - (leftWaterHeight - rightWaterHeight) * (1 - Math.cos(progress * Math.PI)) / 2;
      
              // Use the higher of the two (curve or weir profile)
              y = Math.min(canvas.height - curveHeight, weirProfile);
            } else if (x >= transitionEndX) {
              y = canvas.height - rightWaterHeight;
            }
      
            // Add wave effect
            y += 2 * Math.sin((canvas.width - x) / 20 - time / 200)
              + 1 * Math.sin((canvas.width - x) / 10 - time / 100);
            
            // Apply draining effect
            if (isDraining) {
              y += drainProgress * canvas.height;
            }
            
            ctx.lineTo(x, y);
  
            // Track the maximum water height
            maxWaterHeight = Math.max(maxWaterHeight, canvas.height - y);
          }
          ctx.lineTo(canvas.width * animationProgress, canvas.height);
          ctx.lineTo(0, canvas.height);
          ctx.closePath();
          ctx.fill();
  
          // Add a subtle highlight on the water surface
          ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, canvas.height - leftWaterHeight);
          for (let x = 0; x < canvas.width * animationProgress; x++) {
            let y = canvas.height - leftWaterHeight;
  
            if (x > leftBaseX && x < rightBaseX) {
              const progress = (x - leftBaseX) / (rightBaseX - leftBaseX);
              const transitionHeight = leftWaterHeight - (leftWaterHeight - rightWaterHeight) * progress;
              y = canvas.height - transitionHeight;
  
              const weirSurfaceY = x < weirCenterX
                ? canvas.height - weirHeight * (1 - (x - leftBaseX) / (weirCenterX - leftBaseX))
                : canvas.height - weirHeight * ((x - weirCenterX) / (rightBaseX - weirCenterX));
              y = Math.min(y, weirSurfaceY);
            } else if (x >= rightBaseX) {
              y = canvas.height - rightWaterHeight;
            }
  
            y += 2 * Math.sin((canvas.width - x) / 20 - time / 200)
              + 1 * Math.sin((canvas.width - x) / 10 - time / 100);
            
            if (isDraining) {
              y += drainProgress * canvas.height;
            }
            
            ctx.lineTo(x, y);
          }
          // ctx.stroke();
  
          // Restore canvas state (remove clipping)
          ctx.restore();
  
          // Progress the animation if not paused
          if (animationProgress < 1 && !isPaused) {
            setAnimationProgress(prev => Math.min(prev + 0.00008, 1));
          }
  
          // Progress the draining 
          if (isDraining) {
            setDrainProgress(prev => {
              const newProgress = prev + 0.0002;
              // Check if water is no longer visible
              if (maxWaterHeight <= 0) {
                setWaterPresent(false);
                setIsDraining(false);
                return 0;
              }
              return newProgress;
            });
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
          const numMarks = 2;
          for (let i = 0; i <= numMarks; i++) {
            const y = gaugeBottom - (i / numMarks) * (gaugeBottom - gaugeTop);
            ctx.beginPath();
            ctx.moveTo(gaugeX - 10, y);
            ctx.lineTo(gaugeX + 10, y);
            ctx.stroke();
          }
        });
  
        animationFrameId = requestAnimationFrame(draw);
      };
  
      draw(0);
  
      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }, [leftWaterHeight, waterPresent, animationProgress, gaugePositions, isDraining, drainProgress, isPaused, numberOfGauges]);
  
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      setLeftWaterHeight(Number(e.target.value));
    };
  
    const handleIntroduceWater = () => {
      if (!waterPresent) {
        setWaterPresent(true);
        setAnimationProgress(0);
        setIsDraining(false);
        setDrainProgress(0);
        setIsPaused(false);
      } else {
        setIsPaused(!isPaused);
      }
    };
  
    const handleDrainWater = () => {
      if (waterPresent && !isDraining) {
        setIsDraining(true);
        setDrainProgress(0);
      }
    };
  
    const handleGaugePositionChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      setGaugePositions(prev => {
        const newPositions = [...prev];
        newPositions[index] = Number(e.target.value);
        return newPositions;
      });
    };
  
    const handleNumberOfGaugesChange = (e: ChangeEvent<HTMLSelectElement>) => {
      setNumberOfGauges(Number(e.target.value));
    };
  
    return (
      <div className="w-full max-w-3xl mx-auto p-4 border rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Trapezoidal Weir Flow Animation</h2>
        <div className="mb-4">
          <label htmlFor="left-water-height-input" className="block mb-2">Left Water Height:</label>
          <input
            id="left-water-height-input"
            type="number"
            value={leftWaterHeight}
            onChange={handleInputChange}
            className="w-24 p-1 border rounded"
          />
        </div>
        
        <div className="mb-4">
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
          <div key={index} className="mb-4">
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
        
        <div className="mt-4">
          <button
            onClick={handleIntroduceWater}
            style={{ marginRight: '20px', backgroundColor: '#198b2c', color: 'white' }}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {waterPresent ? (isPaused ? "Resume Water" : "Pause Water") : "Introduce Water"}
          </button>
  
          <button
            onClick={handleDrainWater}
            style={{ backgroundColor: '#DC3545', color: 'white' }}
            className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            disabled={!waterPresent || isDraining}
          >
            Drain Water
          </button>
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
  
  export default TrapezoidalWeir;

