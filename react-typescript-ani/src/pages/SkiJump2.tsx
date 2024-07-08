import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Point {
  x: number;
  y: number;
}

const SkiJump: React.FC = () => {
  const initialWaterLevel = 130;
  const [waterLevel, setWaterLevel] = useState<number>(initialWaterLevel);
  const [waterPresent, setWaterPresent] = useState<boolean>(false);
  const [flowSpeed, setFlowSpeed] = useState<number>(2);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isDraining, setIsDraining] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const deviceShapeRef = useRef<Point[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const gravity = 0.1;
    const particleSize = 1;
    const segmentWidth = 5; // Define segmentWidth here

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

    const bezierPoint = (t: number, p0: number, p1: number, p2: number, p3: number): number => {
      const cX = 3 * (p1 - p0);
      const bX = 3.5 * (p2 - p1) - cX;
      const aX = p3 - p0 - cX - bX;
      return aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0;
    };

    const calculateDeviceShape = () => {
      const points: Point[] = [];
      for (let t = 0; t <= 1; t += 0.01) {
        if (t <= 0.8) {
          const x = bezierPoint(t / 0.8, startX, cp1x, cp2x, endX);
          const y = bezierPoint(t / 0.8, startY, cp1y, cp2y, startY);
          points.push({ x, y });
        } else {
          const mirrorT = (t - 0.8) / 0.2;
          const x = bezierPoint(mirrorT, endX, mirroredCp1x, mirroredCp2x, mirroredEndX);
          const y = bezierPoint(mirrorT, startY, mirroredCp1y, mirroredCp2y, startY);
          points.push({ x, y });
        }
      }
      deviceShapeRef.current = points;
    };

    calculateDeviceShape();

    const skiJumpProfile = (x: number): number => {
      if (x < startX) return canvas.height - waterLevel;
      if (x > mirroredEndX) return canvas.height - 50;
      const point = deviceShapeRef.current.find(p => p.x >= x) || deviceShapeRef.current[deviceShapeRef.current.length - 1];
      return point.y;
    };

    const createParticle = (): Particle => ({
      x: 0,
      y: canvas.height - waterLevel + Math.random() * 10 - 5,
      vx: flowSpeed,
      vy: 0
    });

    const updateParticles = () => {
      if (isDraining) {
        setWaterLevel(prev => Math.max(prev - 0.5, 0));
        if (waterLevel <= 0) {
          resetWaterState();
        }
      }

      if (!waterPresent || isPaused) return;

      // Add new particles
      if (particlesRef.current.length < 1000) {
        particlesRef.current.push(createParticle());
      }

      // Update particle positions
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.vx;
        particle.vy += gravity;
        particle.y += particle.vy;

        const surfaceY = skiJumpProfile(particle.x);

        if (particle.y > surfaceY) {
          particle.y = surfaceY;
          const nextSurfaceY = skiJumpProfile(particle.x + 1);
          const surfaceAngle = Math.atan2(nextSurfaceY - surfaceY, 1);
          const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
          particle.vx = speed * Math.cos(surfaceAngle);
          particle.vy = speed * Math.sin(surfaceAngle);
          particle.vy *= -0.5; // Dampen vertical velocity
        }

        return particle.x < canvas.width && particle.y < canvas.height;
      });
    };

    const drawContinuousWater = (ctx: CanvasRenderingContext2D, time: number) => {
        const gradient = ctx.createLinearGradient(0, canvas.height - waterLevel, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 120, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 20, 170, 0.9)');
      
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
      
        const segmentWidth = 5;
        for (let x = 0; x <= canvas.width; x += segmentWidth) {
          let y;
          
          if (x >= startX && x <= mirroredEndX) {
            // Within device coordinates, use the highest particle to determine water surface
            const relevantParticles = particlesRef.current.filter(p => p.x >= x && p.x < x + segmentWidth);
            if (relevantParticles.length > 0) {
              y = Math.min(...relevantParticles.map(p => p.y));
            } else {
              y = skiJumpProfile(x);
            }
          } else {
            // Outside device, use original wavy pattern
            y = skiJumpProfile(x);
            y += 3 * Math.sin((canvas.width - x) / 30 - time / 300)
              + 2 * Math.sin((canvas.width - x) / 20 - time / 200)
              + Math.sin((canvas.width - x) / 10 - time / 100);
          }
          
          ctx.lineTo(x, y);
        }
      
        // Ensure water fills to the bottom of the canvas
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();

        // Draw an additional highlight on the water surface
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        for (let x = 0; x <= canvas.width; x += segmentWidth) {
          let y;
          if (x >= startX && x <= mirroredEndX) {
            const relevantParticles = particlesRef.current.filter(p => p.x >= x && p.x < x + segmentWidth);
            y = relevantParticles.length > 0 ? Math.min(...relevantParticles.map(p => p.y)) : skiJumpProfile(x);
          } else {
            y = skiJumpProfile(x);
            y += 3 * Math.sin((canvas.width - x) / 30 - time / 300)
              + 2 * Math.sin((canvas.width - x) / 20 - time / 200)
              + Math.sin((canvas.width - x) / 10 - time / 100);
          }
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();
      };
      const drawParticles = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        particlesRef.current.forEach(particle => {
          if (particle.x >= startX && particle.x <= mirroredEndX) {
            const relevantParticles = particlesRef.current.filter(p => 
              p.x >= particle.x - segmentWidth/2 && p.x < particle.x + segmentWidth/2);
            const surfaceY = Math.min(...relevantParticles.map(p => p.y));
            if (particle.y <= surfaceY) {
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2);
              ctx.fill();
            }
          } else {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      };

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

    const draw = (time: number) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (waterPresent) {
          updateParticles();
          drawContinuousWater(ctx, time);
          drawParticles(ctx);
        }
        drawSkiJump(ctx);
        animationFrameId = requestAnimationFrame(draw);
      };

    draw(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [waterLevel, waterPresent, flowSpeed, isPaused, isDraining]);

  const resetWaterState = () => {
    setWaterPresent(false);
    setIsDraining(false);
    setIsPaused(false);
    setWaterLevel(initialWaterLevel);
    particlesRef.current = [];
  };

  const handleWaterLevelChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWaterLevel(Number(e.target.value));
  };

  const handleFlowSpeedChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFlowSpeed(Number(e.target.value));
  };

  const handleWaterToggle = () => {
    if (!waterPresent) {
      setWaterPresent(true);
      setIsPaused(false);
    } else {
      setIsPaused(!isPaused);
    }
  };

  const handleDrainWater = () => {
    setIsDraining(true);
    setIsPaused(true);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Realistic Ski Jump Water Flow</h2>
      <div className="mb-4">
        <label htmlFor="water-level-input" className="block mb-2">Water Level:</label>
        <input
          id="water-level-input"
          type="number"
          value={waterLevel}
          onChange={handleWaterLevelChange}
          className="w-24 p-1 border rounded"
        />
        
        <div className="mt-4">
          <label htmlFor="flow-speed-input" className="block mb-2">Flow Speed:</label>
          <input
            id="flow-speed-input"
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={flowSpeed}
            onChange={handleFlowSpeedChange}
            className="w-full"
          />
          <span>{flowSpeed.toFixed(1)}</span>
        </div>

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

export default SkiJump;