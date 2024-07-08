import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

const RadialGate: React.FC = () => {

    const [h2, setH2] = useState<number>(58); // State to manage water height
    const [waterPresent, setWaterPresent] = useState<boolean>(false); // State to manage if water is present
    const [animationProgress, setAnimationProgress] = useState<number>(0); // State to manage the progress of animation
    const [gaugePositions, setGaugePositions] = useState<number[]>([0, 0]); // State to manage positions of the gauges
    const [isDraining, setIsDraining] = useState<boolean>(false); // State to manage if the water is draining
    const [drainProgress, setDrainProgress] = useState<number>(0); // State to manage the progress of draining
    const [isPaused, setIsPaused] = useState<boolean>(false); // State to manage if the animation is paused
    const [numberOfGauges, setNumberOfGauges] = useState<number>(1); // State to manage the number of gauges
    const [verticalPosition, setVerticalPosition] = useState<number>(15); // State to manage the vertical position of the device
    const canvasRef = useRef<HTMLCanvasElement>(null); // Ref to the canvas element
  
    // Variables to define the dimensions and positions of the Venturi device
    // const deviceWidth = 10;
    // const deviceHeight = 200;

    const deviceWidth = 40;
    const deviceHeight = 150;
    const throatWidth = deviceWidth;
    const throatHeight = deviceHeight;
  
    const h1 = 130;
    const hm = -30;
  
    const transitionStart = -0.8; // 20% of the device width
    const transitionEnd = 2.0;   // 80% of the device width
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
  
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
  
      let animationFrameId: number;
  
      const draw = (time: number) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        const deviceStartX = (canvas.width - deviceWidth) / 2; // Center the device horizontally
        const throatStartX = deviceStartX + (deviceWidth - throatWidth) / 2;
        const deviceEndX = deviceStartX + deviceWidth;
        const throatEndX = throatStartX + throatWidth;
        const deviceStartY = canvas.height - deviceHeight - verticalPosition; // Customizable vertical position
  
  
        let maxWaterHeight = 0;
  
        if (waterPresent) {
          const gradient = ctx.createLinearGradient(0, deviceStartY, 0, deviceStartY + throatHeight);
          gradient.addColorStop(0, 'rgba(0, 120, 255, 0.8)');
          gradient.addColorStop(1, 'rgba(0, 20, 170, 0.9)');
  
          // Draw the water
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(0, deviceStartY + deviceHeight - 80);
  

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
  
            y += 3 * Math.sin((canvas.width - x) / 30 - time / 300)
              // + 2 * Math.sin((canvas.width - x) / 20 - time / 200)
              + 1 * Math.sin((canvas.width - x) / 50 - time / 100)
              ;
  
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
          ctx.moveTo(0, deviceStartY + deviceHeight - 80);
          for (let x = 0; x < canvas.width * animationProgress; x++) {
            let y = deviceStartY + deviceHeight - 80;
            if (x > deviceStartX && x < throatEndX) {
              y += 40 * Math.sin((x - deviceStartX) / deviceWidth * Math.PI);
            }
            if (x > deviceEndX) {
              y = deviceStartY + deviceHeight - h2;
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
  
  
              // // Draw the Venturi device with dynamic dimensions
              // ctx.fillStyle = '#888';
              // ctx.fillRect(deviceStartX, deviceStartY, deviceWidth, deviceHeight);
              // ctx.fillRect(throatStartX, deviceStartY, throatWidth, throatHeight);
  

      
              const centerX = 300; // Center of the circle
              const centerY = 155; // Center of the circle
              const outerRadius = 90; // Outer radius of the circle
              const innerRadius = 80; // Inner radius for the width
              const rotationAngle = 280 * Math.PI / 180; // Rotation angle in radians
              const percentToHide = 50; // Percentage of the half-circle to hide
              const totalDegrees = 180; // Degrees of half-circle
              const hiddenDegrees = (percentToHide / 100) * totalDegrees; // Calculate 20% of 180 degrees
              const hiddenRadians = hiddenDegrees * Math.PI / 180; // Convert degrees to radians
      
              const startAngle = Math.PI / 2 + hiddenRadians; // Start angle, adjusted to hide 20%
              const endAngle = (3 * Math.PI) / 2; // End angle for half-circle
      
              ctx.fillStyle = '#888';
      
              // Save the current context state
              ctx.save();
      
              // Move the context to the center of the circle
              ctx.translate(centerX, centerY);
      
              // Rotate the context
              ctx.rotate(rotationAngle);
      
              // Move the context back
              ctx.translate(-centerX, -centerY);
      


              const extraLength = 50; // Extra length to extend the line beyond the circle
              const extendedRadius = outerRadius + extraLength; // New radius including the extension
              
              const midpointAngle = (startAngle + endAngle) / 2; // Midpoint of the arc

              ctx.strokeStyle = '#555'; // Set line color to #888

              // Set line width
              ctx.lineWidth = 6; // Set the thickness of the line

              // Draw line from center to the midpoint of the arc
              ctx.beginPath();
              ctx.moveTo(centerX, centerY);
              ctx.lineTo(centerX + outerRadius * Math.cos(midpointAngle), centerY + outerRadius * Math.sin(midpointAngle));
              ctx.stroke();



              // Draw the arcs
              ctx.beginPath();
              ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle, false); // Outer arc
              ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true); // Inner arc
              ctx.closePath();
              ctx.fill();


        // Restore the context to its original state
        ctx.restore();




        
        ctx.beginPath();
        ctx.moveTo(centerX, 70); // Starting point of the line
        ctx.lineTo(centerX, 155); // Ending point of the line
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 6;
        ctx.stroke();

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
        <h2 className="text-xl font-bold mb-4">Radial Gate</h2>
  
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
  
  

export default RadialGate;