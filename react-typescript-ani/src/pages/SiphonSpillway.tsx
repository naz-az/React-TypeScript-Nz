import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

const SiphonSpillway: React.FC = () => {
  const initialWaterLevel = 130;

  const [h2, setH2] = useState<number>(10);
  const [waterPresent, setWaterPresent] = useState<boolean>(false);
  const [animationProgress, setAnimationProgress] = useState<number>(0);
  const [gaugePositions, setGaugePositions] = useState<number[]>([0, 0]);
  const [isDraining, setIsDraining] = useState<boolean>(false);
  const [drainProgress, setDrainProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [numberOfGauges, setNumberOfGauges] = useState<number>(1);
  const [trajectoryLength, setTrajectoryLength] = useState<number>(0.3);
  const [xCoordinate, setXCoordinate] = useState<number>(0);
  const [yCoordinate, setYCoordinate] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const deviceWidth = 120;
  const deviceHeight = 120;
  const throatWidth = deviceWidth;
  const throatHeight = deviceHeight;

  const h1 = 85;
  const hm = 50;

  const transitionStart = 0.15;
  const transitionEnd = 0.4;

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

      const width = 110;
      const height = 100;
      const mirroredWidth = width * 0.25;
      const mirroredHeight = height * 0.2;
      const baseHeight = height * 0.06;

      const startX = (canvas.width - width) / 2;
      const startY = canvas.height - baseHeight;
      const endX = startX + width;
      const endY = startY - height;
      const mirroredEndX = endX + mirroredWidth;
      const mirroredEndY = startY - mirroredHeight;

      const cp1x = startX + width * 0.65;
      const cp1y = endY + height * 0.15;
      const cp2x = endX - width * 0.1;
      const cp2y = startY - height * 0.1;
      const mirroredCp1x = endX + mirroredWidth * 0.01;
      const mirroredCp1y = mirroredEndY + mirroredHeight * 1.13;
      const mirroredCp2x = mirroredEndX - mirroredWidth * 0.5101;
      const mirroredCp2y = startY - mirroredHeight * 0.11;

      const jetStartX = endX +13;

      const drawSkiJump = (ctx: CanvasRenderingContext2D) => {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX, endY);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, startY);
        ctx.lineTo(mirroredEndX, startY);
        ctx.lineTo(mirroredEndX, mirroredEndY);
        ctx.bezierCurveTo(mirroredCp2x, mirroredCp2y, mirroredCp1x, mirroredCp1y, endX, startY);
        ctx.closePath();
        ctx.fillStyle = '#888';
        ctx.fill();

        ctx.fillStyle = '#888';
        ctx.beginPath();
        ctx.rect(startX, startY, width + mirroredWidth, baseHeight);
        ctx.fill();
      };

      let maxWaterHeight = 0;

      if (waterPresent) {
        const gradient = ctx.createLinearGradient(0, canvas.height - throatHeight, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 120, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 20, 170, 0.9)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - h1);

        const trajectoryEndX = endX + trajectoryLength * canvas.width;
        const maxHeight = 80;

        for (let x = 0; x < Math.min(canvas.width * animationProgress, jetStartX+5); x++) {
          let progress = (x - deviceStartX) / deviceWidth;
          let y;

          if (progress <= transitionStart) {
            y = canvas.height - h1;
          } else if (progress >= transitionEnd) {
            y = canvas.height - h2;
          } else {
            let t = (progress - transitionStart) / (transitionEnd - transitionStart);
            t = (1 - Math.cos(t * Math.PI)) / 2;
            y = canvas.height - h1 - (hm - h1) * t - (h2 - hm) * Math.pow(t, 2);
          }

          y += 2 * Math.sin((canvas.width - x) / 50 - time / 100);

          if (isDraining) {
            y += canvas.height * drainProgress;
          }

          ctx.lineTo(x, y);
          maxWaterHeight = Math.max(maxWaterHeight, canvas.height - y);
        }

        ctx.lineTo(Math.min(canvas.width * animationProgress, endX), canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();

        if (animationProgress * canvas.width > jetStartX) {
          const jetThickness = 18;
          ctx.beginPath();
          
          for (let x = jetStartX; x <= Math.min(canvas.width * animationProgress, trajectoryEndX); x++) {
            const t = (x - jetStartX) / (trajectoryEndX - jetStartX);
            const horizontalPosition = t;

            const frequency = 2;
            const verticalPosition = Math.sin(frequency * Math.PI * t) + 0.1;
            const diminishingFactor = Math.pow(1 - t, 2);
            
            let y = canvas.height - h2 - maxHeight * verticalPosition * diminishingFactor;
            y += 0.1 * maxHeight * Math.pow(horizontalPosition, 7);
            y += 3 * Math.sin((x - jetStartX) / 10 - time / 50);

            if (isDraining) {
              y += canvas.height * drainProgress;
            }

            ctx.lineTo(x, y);
          }

          for (let x = Math.min(canvas.width * animationProgress, trajectoryEndX); x >= jetStartX; x--) {
            const t = (x - jetStartX) / (trajectoryEndX - jetStartX);
            const horizontalPosition = t;

            const frequency = 2;
            const verticalPosition = Math.sin(frequency * Math.PI * t) + 0.1;
            const diminishingFactor = Math.pow(1 - t, 2);
            
            let y = canvas.height - h2 - maxHeight * verticalPosition * diminishingFactor;
            y += 0.1 * maxHeight * Math.pow(horizontalPosition, 7);
            y += 6 * Math.sin((x - endX) / 60 - time / 80);
            y += jetThickness;

            if (isDraining) {
              y += canvas.height * drainProgress;
            }

            ctx.lineTo(x, y);
          }

          ctx.closePath();
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        if (animationProgress < 1 && !isPaused) {
          setAnimationProgress(prev => Math.min(prev + 0.00005, 1));
        }

        if (isDraining) {
          setDrainProgress(prev => {
            const newProgress = prev + 0.0002;
            if (newProgress >= 1) {
              setWaterPresent(false);
              setIsDraining(false);
              return 0;
            }
            return newProgress;
          });
        }
      }

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

      const scale = 0.35;
      const rotation = 30 * Math.PI / 180;
      const xOffset = 150; // Adjust this value to move the device horizontally
      const yOffset = 80;  // Adjust this value to move the device vertically
      
      function rotatePoint(x, y, centerX, centerY) {
        const dx = x - centerX;
        const dy = y - centerY;
        return {
          x: centerX + dx * Math.cos(rotation) - dy * Math.sin(rotation) + xOffset,
          y: centerY + dx * Math.sin(rotation) + dy * Math.cos(rotation) + yOffset
        };
      }
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;
      
      ctx.beginPath();
      
      let startPoint = rotatePoint(130 * scale, canvasHeight - 50 * scale, centerX, centerY);
      ctx.moveTo(startPoint.x, startPoint.y);
      
      let p1 = rotatePoint(100 * scale, canvasHeight - 150 * scale, centerX, centerY);
      let p2 = rotatePoint(150 * scale, canvasHeight - 200 * scale, centerX, centerY);
      let p3 = rotatePoint(200 * scale, canvasHeight - 200 * scale, centerX, centerY);
      ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      
      p1 = rotatePoint(250 * scale, canvasHeight - 200 * scale, centerX, centerY);
      p2 = rotatePoint(300 * scale, canvasHeight - 150 * scale, centerX, centerY);
      p3 = rotatePoint(350 * scale, canvasHeight - 100 * scale, centerX, centerY);
      ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      
      p1 = rotatePoint(400 * scale, canvasHeight - 50 * scale, centerX, centerY);
      p2 = rotatePoint(450 * scale, canvasHeight - 50 * scale, centerX, centerY);
      p3 = rotatePoint(500 * scale, canvasHeight - 100 * scale, centerX, centerY);
      ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      
      p1 = rotatePoint(550 * scale, canvasHeight - 150 * scale, centerX, centerY);
      p2 = rotatePoint(600 * scale, canvasHeight - 450 * scale, centerX, centerY);
      p3 = rotatePoint(188, 240, centerX, centerY);
      ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      
      ctx.stroke();
      
      const gradientRotated = ctx.createLinearGradient(xOffset, yOffset, canvasWidth + xOffset, canvasHeight + yOffset);
      gradientRotated.addColorStop(0, '#4169E1');
      gradientRotated.addColorStop(1, '#1E90FF');
      ctx.strokeStyle = gradientRotated;
      ctx.lineWidth = 40 * scale;
      ctx.stroke();



      animationFrameId = requestAnimationFrame(draw);
    };

    draw(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [h2, waterPresent, animationProgress, gaugePositions, isDraining, drainProgress, isPaused, numberOfGauges, trajectoryLength, xCoordinate, yCoordinate]);

  // Event handlers (unchanged)
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

  const handleTrajectoryLengthChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTrajectoryLength(Number(e.target.value));
  };

  const handleXCoordinateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setXCoordinate(Number(e.target.value));
    console.log(`X coordinate: ${(Number(e.target.value) * 500).toFixed(2)}`);
  };

  const handleYCoordinateChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(`Y coordinate: ${(Number(e.target.value) * 300).toFixed(2)}`);
    setYCoordinate(Number(e.target.value));
  };
  return (
    <div className="w-full max-w-3xl mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Siphon Spillway Flow Animation</h2>

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
        <label htmlFor="trajectory-length" className="block mb-2">Trajectory Length:</label>
        <input
          id="trajectory-length"
          type="range"
          min="0.1"
          max="0.5"
          step="0.01"
          value={trajectoryLength}
          onChange={handleTrajectoryLengthChange}
          className="w-full"
        />
        <output className="block p-2 border rounded">
          {(trajectoryLength * 100).toFixed(0)}% of canvas width
        </output>
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

<div className="mb-4">
        <label htmlFor="x-coordinate" className="block mb-2">X Coordinate:</label>
        <input
          id="x-coordinate"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={xCoordinate}
          onChange={handleXCoordinateChange}
          className="w-full"
        />
        <output className="block p-2 border rounded">
          X: {(xCoordinate * 100).toFixed(2)}%
        </output>
      </div>

      <div className="mb-4">
        <label htmlFor="y-coordinate" className="block mb-2">Y Coordinate:</label>
        <input
          id="y-coordinate"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={yCoordinate}
          onChange={handleYCoordinateChange}
          className="w-full"
        />
        <output className="block p-2 border rounded">
          Y: {(yCoordinate * 100).toFixed(2)}%
        </output>
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

export default SiphonSpillway;