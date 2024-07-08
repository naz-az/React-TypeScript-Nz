import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

  const RoughenedBed: React.FC = () => {
    const [h2, setH2] = useState<number>(90); // State to manage water height
  const [waterPresent, setWaterPresent] = useState<boolean>(false); // State to manage if water is present
  const [animationProgress, setAnimationProgress] = useState<number>(0); // State to manage the progress of animation
  const [gaugePositions, setGaugePositions] = useState<number[]>([0, 0]); // State to manage positions of the gauges
  const [isDraining, setIsDraining] = useState<boolean>(false); // State to manage if the water is draining
  const [drainProgress, setDrainProgress] = useState<number>(0); // State to manage the progress of draining
  const [isPaused, setIsPaused] = useState<boolean>(false); // State to manage if the animation is paused
  const [numberOfGauges, setNumberOfGauges] = useState<number>(1); // State to manage the number of gauges
  const [verticalPosition, setVerticalPosition] = useState<number>(0); // State to manage the vertical position of the device
  const canvasRef = useRef<HTMLCanvasElement>(null); // Ref to the canvas element

  // Variables to define the dimensions and positions of the Venturi device
  const deviceWidth = 400;
  const deviceHeight = 10;
  const throatWidth = deviceWidth;
  const throatHeight = deviceHeight;

  const h1 = 100;
  const hm = 80;

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
      const deviceStartY = canvas.height - deviceHeight - verticalPosition;

      let maxWaterHeight = 0;

      if (waterPresent) {
        const gradient = ctx.createLinearGradient(0, deviceStartY, 0, deviceStartY + throatHeight);
        gradient.addColorStop(0, 'rgba(0, 120, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 20, 170, 0.9)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, deviceStartY + deviceHeight - h1);

        for (let x = 0; x < canvas.width * animationProgress; x++) {
          let progress = (x - deviceStartX) / deviceWidth;
          let y;

          if (x <= deviceStartX) {
            y = deviceStartY + deviceHeight - h1;
          } else if (x >= deviceEndX) {
            y = deviceStartY + deviceHeight - h2;
          } else {
            // Smooth transition using cosine interpolation
            let t = (1 - Math.cos(progress * Math.PI)) / 2;
            y = deviceStartY + deviceHeight - h1 - (hm - h1) * t - (h2 - hm) * Math.pow(t, 2);
          }

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

      // Draw the Venturi device
      ctx.fillStyle = '#888';
      ctx.fillRect(deviceStartX, deviceStartY, deviceWidth, deviceHeight);
      ctx.fillRect(throatStartX, deviceStartY, throatWidth, throatHeight);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [h2, waterPresent, animationProgress, gaugePositions, isDraining, drainProgress, isPaused, numberOfGauges, verticalPosition]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setH2(Number(e.target.value));
  };

  const handleVerticalPositionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVerticalPosition(Number(e.target.value));
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
      <h2 className="text-xl font-bold mb-4">RoughenedBed</h2>

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

      // Inside the return statement of the component
      <div className="mb-4">
  <label htmlFor="vertical-position-input" className="block mb-2">Vertical Position:</label>
  <input
    id="vertical-position-input"
    type="number"
    value={verticalPosition}
    onChange={handleVerticalPositionChange}
    className="w-24 p-1 border rounded"
    max="60" // Maximum limit for the number input
  />
  <input
    id="vertical-position-slider"
    type="range"
    min="0"
    max="60" // Maximum limit for the slider
    value={verticalPosition}
    onChange={handleVerticalPositionChange}
    className="w-full"
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


export default RoughenedBed;