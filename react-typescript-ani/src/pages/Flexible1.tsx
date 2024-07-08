import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

// Component for Venturi Flow Animation
const Flexible1: React.FC = () => {
  const [h2, setH2] = useState<number>(100); // State to manage water height
  const [waterPresent, setWaterPresent] = useState<boolean>(false); // State to manage if water is present
  const [animationProgress, setAnimationProgress] = useState<number>(0); // State to manage the progress of animation
  const [gaugePositions, setGaugePositions] = useState<number[]>([0, 0]); // State to manage positions of the gauges
  const [isDraining, setIsDraining] = useState<boolean>(false); // State to manage if the water is draining
  const [drainProgress, setDrainProgress] = useState<number>(0); // State to manage the progress of draining
  const [isPaused, setIsPaused] = useState<boolean>(false); // State to manage if the animation is paused
  const [numberOfGauges, setNumberOfGauges] = useState<number>(1); // State to manage the number of gauges
  const canvasRef = useRef<HTMLCanvasElement>(null); // Ref to the canvas element

  // Variables to define the dimensions and positions of the Venturi device
  const deviceWidth = 40;
  const deviceHeight = 200;
  const throatWidth = deviceWidth;
  const throatHeight = deviceHeight;
  const deviceStartX = 200;
  const throatStartX = deviceStartX + (deviceWidth - throatWidth) / 2;
  const deviceEndX = deviceStartX + deviceWidth;
  const throatEndX = throatStartX + throatWidth;

  const h1=20;
  const hm=0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the Venturi device with dynamic dimensions
      ctx.fillStyle = '#888';
      ctx.fillRect(deviceStartX, canvas.height - deviceHeight, deviceWidth, deviceHeight);
      ctx.fillRect(throatStartX, canvas.height - throatHeight, throatWidth, throatHeight);

      let maxWaterHeight = 0;

      if (waterPresent) {
        const gradient = ctx.createLinearGradient(0, canvas.height - throatHeight, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 120, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 20, 170, 0.9)');

        // Draw the water
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 80);

        // Loop to draw the water wave pattern
        for (let x = 0; x < canvas.width * animationProgress; x++) {
          // let y = canvas.height;


          // 2. Middle Part

          let y = canvas.height - 80 - h1;


          // 2. Middle Part
          if (x > deviceStartX && x < deviceEndX) {

            //Adjust height of middle part (the higher number, the lower the level of water in middle)
            y=300+10-hm;
            // y += 40 * Math.sin((x - deviceStartX) / deviceWidth * Math.PI); // Water wave effect in the throat
          }

          // 3. Third Part
          if (x > deviceEndX) {
            y = canvas.height - h2; // Set water height after the throat
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

        ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 80);
        for (let x = 0; x < canvas.width * animationProgress; x++) {
          let y = canvas.height - 80;
          if (x > deviceStartX && x < throatEndX) {
            y += 40 * Math.sin((x - deviceStartX) / deviceWidth * Math.PI);
          }
          if (x > deviceEndX) {
            y = canvas.height - h2;
          }
          y += 3 * Math.sin((canvas.width - x) / 30 - time / 300)
            + 2 * Math.sin((canvas.width - x) / 20 - time / 200)
            + 1 * Math.sin((canvas.width - x) / 10 - time / 100);

          if (isDraining) {
            y += drainProgress * canvas.height;
          }

          // ctx.lineTo(x, y);
        }
        ctx.stroke();

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
      <h2 className="text-xl font-bold mb-4">Flow Animation</h2>
      
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

export default Flexible1;
