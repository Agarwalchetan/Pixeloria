import React, { useEffect, useRef } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      trailRef.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      });

      // Keep only recent points (last 500ms)
      const now = Date.now();
      trailRef.current = trailRef.current.filter(point => now - point.timestamp < 500);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const trail = trailRef.current;
      if (trail.length < 2) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const now = Date.now();
      
      // Draw trail
      for (let i = 1; i < trail.length; i++) {
        const point = trail[i];
        const prevPoint = trail[i - 1];
        const age = now - point.timestamp;
        const opacity = Math.max(0, 1 - age / 500);
        const size = Math.max(1, 8 * opacity);

        // Create gradient
        const gradient = ctx.createLinearGradient(
          prevPoint.x, prevPoint.y,
          point.x, point.y
        );
        gradient.addColorStop(0, `rgba(59, 130, 246, ${opacity * 0.3})`);
        gradient.addColorStop(1, `rgba(147, 51, 234, ${opacity * 0.5})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(prevPoint.x, prevPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();

        // Add glow effect
        ctx.shadowBlur = size * 2;
        ctx.shadowColor = '#3B82F6';
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default CursorTrail;