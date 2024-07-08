import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

const SkiJump: React.FC = () => {
  const [h2, setH2] = useState<number>(10);
  const [waterPresent, setWaterPresent] = useState<boolean>(false);
  const [animationProgress, setAnimationProgress] = useState<number>(0);
  const [gaugePositions, setGaugePositions] = useState<number[]>([0, 0]);
  const [isDraining, setIsDraining] = useState<boolean>(false);
  const [drainProgress, setDrainProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [numberOfGauges, setNumberOfGauges] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const deviceWidth = 120;
  const deviceHeight = 120;
  const throatWidth = deviceWidth;
  const throatHeight = deviceHeight;

  const h1 = 125;
  const hm = 50;

  const transitionStart = -0.09;
  const transitionEnd = 1.33;

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

      // Draw the device with dynamic dimensions
      const deviceColor = '#888';
      const baseColor = '#444';

      // Calculate the starting point to center the shape
      const startX = (canvas.width - width) / 2;
      const startY = canvas.height - height * 0.08;
      const endX = startX + width;
      const endY = startY - height;

      // Calculate control points for bezier curve
      const cp1x = startX + width * 0.65;
      const cp1y = endY + height * 0.15;
      const cp2x = endX - width * 0.1;
      const cp2y = startY - height * 0.1;

      // Draw main device
      ctx.beginPath();
      ctx.moveTo(endX, startY);
      ctx.lineTo(startX, startY);
      ctx.lineTo(startX, endY);
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, startY);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = deviceColor;
      ctx.fill();

      // Draw mirrored device
      const mirroredWidth = width * 0.25;
      const mirroredHeight = height * 0.2;
      const mirroredStartX = endX;
      const mirroredStartY = startY;
      const mirroredEndX = mirroredStartX + mirroredWidth;
      const mirroredEndY = mirroredStartY - mirroredHeight;

      const mirroredCp1x = mirroredStartX + mirroredWidth * 0.2;
      const mirroredCp1y = mirroredEndY + mirroredHeight * 1.3;
      const mirroredCp2x = mirroredEndX - mirroredWidth * 1.01;
      const mirroredCp2y = mirroredStartY - mirroredHeight * 0.11;

      ctx.beginPath();
      ctx.moveTo(mirroredStartX, mirroredStartY);
      ctx.lineTo(mirroredEndX, mirroredStartY);
      ctx.lineTo(mirroredEndX, mirroredEndY);
      ctx.bezierCurveTo(mirroredCp1x, mirroredCp1y, mirroredCp2x, mirroredCp2y, mirroredStartX, mirroredStartY);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = deviceColor;
      ctx.fill();

      // Draw rectangular base
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.rect(
        startX,
        startY,
        width + mirroredWidth,
        height * 0.08
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
      
        const jumpPoint = endX;
        const jumpHeight = mirroredStartY - mirroredHeight+100;
        const landingPoint = canvas.width * 0.09;
        
        for (let x = 0; x < canvas.width * animationProgress; x++) {
          let progress = (x - deviceStartX) / deviceWidth;
          let y;
      
          if (x < jumpPoint) {
            // Original left-side flow logic
            if (progress <= transitionStart) {
              y = canvas.height - h1;
            } else if (progress >= transitionEnd) {
              y = canvas.height - h2;
            } else {
              let t = (progress - transitionStart) / (transitionEnd - transitionStart);
              t = (1 - Math.cos(t * Math.PI)) / 2;
              y = canvas.height - h1 - (hm - h1) * t - (h2 - hm) * Math.pow(t, 2);
            }

            // Add more natural waves
            y += 2 * Math.sin((canvas.width - x) / 20 - time / 200)
              + 1.5 * Math.sin((canvas.width - x) / 15 - time / 150)
              + 1 * Math.sin((canvas.width - x) / 10 - time / 100);

          } else if (x < landingPoint) {
            // Parabolic trajectory for the jump
            const t = (x - jumpPoint) / (landingPoint - jumpPoint);
            const h = 4 * (mirroredStartY - jumpHeight); // Max height of the jump
            y = jumpHeight + h * t * (1 - t);

            // Add waves to the jump
            y += 2 * Math.sin((x / canvas.width) * 10 - time / 200)
              + 1.5 * Math.cos((x / canvas.width) * 15 - time / 150);
          } else {
            // Water flow after landing
            const t = (x - landingPoint) / (canvas.width - landingPoint);
            y = mirroredStartY + (canvas.height - mirroredStartY) * Math.pow(t, 0.5);

            // Add waves after landing
            y += 2 * Math.sin((x / canvas.width) * 10 - time / 200)
              + 1.5 * Math.cos((x / canvas.width) * 15 - time / 150);
          }
      
          // Apply draining effect
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

  // Event handlers remain unchanged
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

  // JSX remains unchanged
  return (
    <div className="w-full max-w-3xl mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Ski jump Flow Animation</h2>
      
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

export default SkiJump;