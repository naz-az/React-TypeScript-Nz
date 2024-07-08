import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

const SkiJump: React.FC = () => {
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const deviceWidth = 120;
  const deviceHeight = 120;
  const throatWidth = deviceWidth;
  const throatHeight = deviceHeight;

  const h1 = 110;
  const hm = 90;

  const transitionStart = 0.1;
  const transitionEnd = 1.1;

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

      const jetStartX = endX + 4; // Push the jet start x-coordinate by 20 pixels

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
        const maxHeight = 50; // Maximum height of the trajectory

        // Original water flow animation up to endX
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

          // Add wave effect for the part before endX
          y += 
          // 4 * Math.sin((canvas.width - x) / 50 - time / 300)
            // + 2 * Math.sin((canvas.width - x) / 20 - time / 200)
            + 2 * Math.sin((canvas.width - x) / 50 - time / 100)
            ;

          // Apply draining effect
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

        // Draw water jet after endX
        if (animationProgress * canvas.width > jetStartX) {
          const jetThickness = 18;
          ctx.beginPath();
          
          // Top of the jet
          for (let x = jetStartX; x <= Math.min(canvas.width * animationProgress, trajectoryEndX); x++) {
            const t = (x - jetStartX) / (trajectoryEndX - jetStartX);

          // for (let x = endX; x <= Math.min(canvas.width * animationProgress, trajectoryEndX); x++) {
            // const t = (x - endX) / (trajectoryEndX - endX);
            const horizontalPosition = t;

            const frequency = 2;
            const verticalPosition = Math.sin(frequency * Math.PI * t) + 0.1;
            const diminishingFactor = Math.pow(1 - t, 2);
            
            let y = canvas.height - h2 - maxHeight * verticalPosition * diminishingFactor;
            y += 0.1 * maxHeight * Math.pow(horizontalPosition, 7);
            // y += 1 * Math.sin((x - endX) / 10 - time / 50);
            y += 1 * Math.sin((x - jetStartX) / 10 - time / 50);


            // Apply draining effect to the water jet
            if (isDraining) {
              y += canvas.height * drainProgress;
            }

            ctx.lineTo(x, y);
          }

          // Bottom of the jet
          for (let x = Math.min(canvas.width * animationProgress, trajectoryEndX); x >= jetStartX; x--) {
            const t = (x - jetStartX) / (trajectoryEndX - jetStartX);
            const horizontalPosition = t;

            const frequency = 2;
            const verticalPosition = Math.sin(frequency * Math.PI * t) + 0.1;
            const diminishingFactor = Math.pow(1 - t, 2);
            
            let y = canvas.height - h2 - maxHeight * verticalPosition * diminishingFactor;
            y += 0.1 * maxHeight * Math.pow(horizontalPosition, 7);
            y += 1 * Math.sin((x - endX) / 10 - time / 50);
            y += jetThickness;

            // Apply draining effect to the water jet
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
            const newProgress = prev + 0.0002; //  draining speed
            if (newProgress >= 1) {
              setWaterPresent(false);
              setIsDraining(false);
              return 0;
            }
            return newProgress;
          });
        }
      }

      // Draw gauges (unchanged)
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

      drawSkiJump(ctx);


      animationFrameId = requestAnimationFrame(draw);
    };

    draw(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [h2, waterPresent, animationProgress, gaugePositions, isDraining, drainProgress, isPaused, numberOfGauges, trajectoryLength]);

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


  return (
    <div className="w-full max-w-3xl mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Ski Jump Flow Animation</h2>

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
    </div>
  );
};

export default SkiJump;