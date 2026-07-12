import { useEffect, useRef } from 'react';

export default function StarfieldCanvas() {
  const canvasRef = useRef(null);
  const constellationsRef = useRef([]);

  useEffect(() => {
    // Add cache buster so the browser always loads the fresh JSON without requiring a hard refresh
    fetch('/constellation_data.json?v=' + Date.now())
      .then(res => res.json())
      .then(data => {
        // Pre-calculate lines for performance to avoid O(N^2) in the draw loop
        data.forEach(c => {
          c.lines = [];
          const maxDist = 0.018; 
          for(let i=0; i<c.points.length; i++) {
            for(let j=i+1; j<c.points.length; j++) {
              const dx = c.points[i][0] - c.points[j][0];
              const dy = c.points[i][1] - c.points[j][1];
              if (dx*dx + dy*dy < maxDist*maxDist) {
                c.lines.push([i, j]);
              }
            }
          }
        });
        constellationsRef.current = data;
      })
      .catch(err => console.error('Failed to load constellation data:', err));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const STAR_COUNT = 6000;
    
    // Initialize stars
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      baseX: Math.random() * width,
      baseY: Math.random() * height,
      tx: 0,
      ty: 0,
      speed: Math.random() * 0.1 + 0.05,
      radius: Math.random() * 0.8 + 0.2,
      brightness: Math.random(),
      offset: Math.random() * 100,
      twinkle: Math.random() * 0.02 + 0.01,
    }));

    let isHovering = false;
    let assemblyPhase = 0;
    let activeData = null;
    let targetIndex = 0;
    let cx = 0;
    let cy = 0;
    const constellationSpeed = 0.15; // Matches average background star speed

    const onMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const dataArr = constellationsRef.current;
      
      if (dataArr.length === 0) return;

      if (!isHovering) {
        isHovering = true;
        activeData = dataArr[targetIndex % dataArr.length];
        targetIndex++;
        cx = mouseX;
        cy = mouseY;
        
        // Magnetize: use only the stars that are physically closest to the mouse!
        stars.sort((a, b) => {
          const distA = (a.x - cx)**2 + (a.y - cy)**2;
          const distB = (b.x - cx)**2 + (b.y - cy)**2;
          return distA - distB;
        });
        
        // Ensure fluid vertical morphing by sorting the chosen stars by Y coordinate
        if (activeData && activeData.points) {
          const activeCount = activeData.points.length;
          const activeStars = stars.slice(0, activeCount);
          activeStars.sort((a, b) => a.y - b.y);
          for (let i = 0; i < activeCount; i++) {
            stars[i] = activeStars[i];
          }
        }
      } else {
        // If mouse moves far away from the current constellation, break it and form a new one
        const dist = Math.hypot(mouseX - cx, mouseY - cy);
        if (dist > 350) {
          assemblyPhase = 0.1; // Drops phase to hide lines and make it morph smoothly
          activeData = dataArr[targetIndex % dataArr.length];
          targetIndex++;
          cx = mouseX;
          cy = mouseY;
          
          // Re-magnetize for the new position
          stars.sort((a, b) => {
            const distA = (a.x - cx)**2 + (a.y - cy)**2;
            const distB = (b.x - cx)**2 + (b.y - cy)**2;
            return distA - distB;
          });
          
          // Ensure fluid vertical morphing
          if (activeData && activeData.points) {
            const activeCount = activeData.points.length;
            const activeStars = stars.slice(0, activeCount);
            activeStars.sort((a, b) => a.y - b.y);
            for (let i = 0; i < activeCount; i++) {
              stars[i] = activeStars[i];
            }
          }
        }
      }
    };
    
    const onMouseLeave = () => {
      isHovering = false;
    };
    
    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', onResize);

    let animId;
    let time = 0;

    const draw = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#121316';
      ctx.fillRect(0, 0, width, height);

      time += 1;

      // Lerp assembly phase for smooth transitions
      if (isHovering) {
        assemblyPhase += (1 - assemblyPhase) * 0.05;
      } else {
        assemblyPhase += (0 - assemblyPhase) * 0.05;
      }

      // Drift the entire constellation to the left with the background
      if (activeData && isHovering) {
        cx -= constellationSpeed;
        
        const size = Math.min(width, height) * 0.65;
        const aspect = activeData.aspect || 1;
        const drawW = size * aspect;
        const drawH = size;
        const ox = cx - drawW * 0.5;
        const oy = cy - drawH * 0.5;

        // Dynamically update target coordinates so they move left
        for (let i = 0; i < stars.length; i++) {
          if (i < activeData.points.length) {
            stars[i].tx = ox + activeData.points[i][0] * drawW;
            stars[i].ty = oy + activeData.points[i][1] * drawH;
          } else {
            stars[i].tx = stars[i].baseX;
            stars[i].ty = stars[i].baseY;
          }
        }
      }

      // 1. Update and draw stars
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Always update background drift
        s.baseX -= s.speed;
        if (s.baseX < -5) {
          s.baseX = width + 5;
          s.baseY = Math.random() * height;
          if (assemblyPhase < 0.01) s.x = s.baseX; 
        }

        // Interpolate position with fast, snappy spring physics
        if (isHovering && activeData && i < activeData.points.length) {
          const dx = s.tx - s.x;
          const dy = s.ty - s.y;
          
          const spring = 0.08; 
          const friction = 0.75; 
          
          s.vx += dx * spring;
          s.vy += dy * spring;
          
          s.vx *= friction;
          s.vy *= friction;
          
          s.x += s.vx;
          s.y += s.vy;
        } else {
          s.x += (s.baseX - s.x) * 0.25; // Scatter back to background much faster
          s.y += (s.baseY - s.y) * 0.25;
          s.vx = 0;
          s.vy = 0;
        }

        const tw = Math.sin(time * s.twinkle + s.offset) * 0.4 + 0.6;
        const alpha = s.brightness * tw + (assemblyPhase * 0.1); // Glow up subtly when assembled

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * (1 + assemblyPhase * 0.2), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 255, ${Math.min(1, alpha)})`;
        ctx.fill();
      }

      // 2. Draw connective lines ONLY when assembled
      if (assemblyPhase > 0.1 && activeData) {
        ctx.globalAlpha = assemblyPhase;
        
        for (const [i, j] of activeData.lines) {
          if (i >= stars.length || j >= stars.length) continue;
          
          const s1 = stars[i];
          const s2 = stars[j];
          
          const dist1 = Math.abs(s1.x - s1.tx) + Math.abs(s1.y - s1.ty);
          const dist2 = Math.abs(s2.x - s2.tx) + Math.abs(s2.y - s2.ty);
          
          if (dist1 < 30 && dist2 < 30) {
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.strokeStyle = `rgba(180, 210, 255, ${assemblyPhase * 0.15})`; // Much more subtle lines
            ctx.lineWidth = 0.4; // Thinner lines to match background better
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1.0;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Allow clicks to pass through to the form
        background: '#121316'
      }}
    />
  );
}
