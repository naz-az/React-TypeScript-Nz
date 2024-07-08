import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

const SlopingApron: React.FC = () => {





    // Component for Venturi Flow Animation
      const [h2, setH2] = useState<number>(10); // State to manage water height
      const [waterPresent, setWaterPresent] = useState<boolean>(false); // State to manage if water is present
      const [animationProgress, setAnimationProgress] = useState<number>(0); // State to manage the progress of animation
      const [gaugePositions, setGaugePositions] = useState<number[]>([0, 0]); // State to manage positions of the gauges
      const [isDraining, setIsDraining] = useState<boolean>(false); // State to manage if the water is draining
      const [drainProgress, setDrainProgress] = useState<number>(0); // State to manage the progress of draining
      const [isPaused, setIsPaused] = useState<boolean>(false); // State to manage if the animation is paused
      const [numberOfGauges, setNumberOfGauges] = useState<number>(1); // State to manage the number of gauges
      const canvasRef = useRef<HTMLCanvasElement>(null); // Ref to the canvas element
    
      // Variables to define the dimensions and positions of the Venturi device
      const deviceWidth = 120;
      const deviceHeight = 120;
      const throatWidth = deviceWidth;
      const throatHeight = deviceHeight;
      // const deviceStartX = 200;
      // const throatStartX = deviceStartX + (deviceWidth - throatWidth) / 2;
      // const deviceEndX = deviceStartX + deviceWidth;
      // const throatEndX = throatStartX + throatWidth;
    
      const h1=125;
      const hm=60;
    

      const transitionStart = -0.02; // 20% of the device width
      const transitionEnd = 1.3;   // 80% of the device width


      useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
    
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
    
        let animationFrameId: number;
    
        const draw = (time: number) => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
    


          const deviceStartX = (canvas.width - deviceWidth) / 2;
          const throatStartX = deviceStartX + (deviceWidth - throatWidth) / 2;
          const deviceEndX = deviceStartX + deviceWidth;
          const throatEndX = throatStartX + throatWidth;

// Define variables for shape properties
const width = 110;
const height = 100;
const curvePosition = 0.6; // 0 to 1, where 0 is top and 1 is bottom
const curveDegree = 0.1; // 0 to 1, where 1 is maximum curve

// Draw the  device with dynamic dimensions
const deviceColor = '#888';
const baseColor = '#444';  // Darker color for the base

// Calculate trapezium base dimensions
const baseTopWidth = deviceWidth ;
const baseBottomWidth = baseTopWidth + deviceWidth * 0.25; // Slightly longer bottom base
const baseHeight = deviceHeight * 0.08; // 20% of device height for the base


// Calculate the starting point to center the shape
const startX = (canvas.width - width) / 2;
const startY = canvas.height - baseHeight;
const endX = startX + width;
const endY = startY - height;

// Calculate control points for bezier curve
const cp1x = startX + width * 0.65;
const cp1y = endY + height * 0.15; // Adjust this value to control the top curve
const cp2x = endX - width * 0.1; // Moved closer to endX for straighter bottom
const cp2y = startY - height * 0.1; // Moved closer to startY for straighter bottom

// Start a new path
ctx.beginPath();

// Move to the starting point (bottom right)
ctx.moveTo(endX, startY);

// Draw bottom line (right to left)
ctx.lineTo(startX, startY);

// Draw left side line (from bottom to top)
ctx.lineTo(startX, endY);

// Draw modified curve back to starting point
ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, startY);

// Set line color and width
ctx.strokeStyle = '#000000';
ctx.lineWidth = 2;

// Stroke the path
ctx.stroke();

// Fill with off-white color
ctx.fillStyle = deviceColor;
ctx.fill();


// Define rectangular base dimensions
const baseRightExtension = deviceWidth * 0.25; // 20% of device width extension on the right

// Draw rectangular base
ctx.fillStyle = baseColor;
ctx.beginPath();
// Start from the top-left corner, aligned with the device
ctx.rect(
    startX, // Use startX instead of deviceStartX to align with the device
    canvas.height - baseHeight, 
    width + baseRightExtension, // Use width instead of deviceWidth
    baseHeight
);
ctx.fill();
          

          let maxWaterHeight = 0;
    
          if (waterPresent) {
            const gradient = ctx.createLinearGradient(0, canvas.height - throatHeight, 0, canvas.height);
            gradient.addColorStop(0, 'rgba(0, 120, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 20, 170, 0.9)');
    
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(0, canvas.height - h1);
    
            for (let x = 0; x < canvas.width * animationProgress; x++) {
          let progress = (x - deviceStartX) / deviceWidth;
          let y;

          if (progress <= transitionStart) {
            y = canvas.height - h1;
          } else if (progress >= transitionEnd) {
            y = canvas.height - h2;
          } else {
            // Smooth transition using cosine interpolation
            let t = (progress - transitionStart) / (transitionEnd - transitionStart);
            t = (1 - Math.cos(t * Math.PI)) / 2;
            y = canvas.height - h1 - (hm - h1) * t - (h2 - hm) * Math.pow(t, 2);
          }
    
              // Add wave effect
              y += 3 * Math.sin((canvas.width - x) / 30 - time / 300)
                + 2 * Math.sin((canvas.width - x) / 20 - time / 200)
                + 1 * Math.sin((canvas.width - x) / 10 - time / 100);
    
              if (isDraining) {
                y += drainProgress * canvas.height;
              }
    
              ctx.lineTo(x, y);
              maxWaterHeight = Math.max(maxWaterHeight, canvas.height - y);
            }
    
            ctx.lineTo(canvas.width * animationProgress, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();
            ctx.fill();
    
            if (animationProgress < 1 && !isPaused) {
              setAnimationProgress(prev => Math.min(prev + 0.00005, 1));
            }
    
            if (isDraining) {
              setDrainProgress(prev => {
                const newProgress = prev + 0.0002;
                if (maxWaterHeight <= 0) {
                  setWaterPresent(false);
                  setIsDraining(false);
                  return 0;
                }
                return newProgress;
              });
            }
          }
    
          // Draw gauges
          gaugePositions.slice(0, numberOfGauges).forEach((position, index) => {
            const gaugeX = position * canvas.width;
            const gaugeTop = canvas.height * 0.25;
            const gaugeBottom = canvas.height;
    
            ctx.strokeStyle = index === 0 ? 'olive' : 'purple';
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(gaugeX, gaugeBottom);
            ctx.lineTo(gaugeX, gaugeTop);
            ctx.stroke();
    
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
    
          animationFrameId = requestAnimationFrame(draw);
        };
    
        draw(0);
    
        return () => {
          cancelAnimationFrame(animationFrameId);
        };
      }, [h2, waterPresent, animationProgress, gaugePositions, isDraining, drainProgress, isPaused, numberOfGauges]);
    
      const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setH2(Number(e.target.value));
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
          <h2 className="text-xl font-bold mb-4">Sloping Apron Flow Animation</h2>
          
          <div className="mb-4">
            <label htmlFor="h2-input" className="block mb-2">Water Height (h2):</label>
            <input
              id="h2-input"
              type="number"
              value={h2}
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
    
    



export default SlopingApron;