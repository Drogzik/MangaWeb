import { useEffect, useRef } from 'react';

export default function StarfieldCanvas() {
  const canvasRef = useRef(null);
  const constellationsRef = useRef([]);

  // No need for shuffleArray anymore

  useEffect(() => {
    // Add cache buster so the browser always loads the fresh JSON without requiring a hard refresh
    fetch('/constellation_data.json?v=' + Date.now())
      .then(res => res.json())
      .then(data => {
        // Pre-calculate lines for performance to avoid O(N^2) in the draw loop
        data.forEach(c => {
          c.lines = [];
          const maxDistSq = 0.018 * 0.018; 
          for(let i=0; i<c.points.length; i++) {
            for(let j=i+1; j<c.points.length; j++) {
              const dx = c.points[i][0] - c.points[j][0];
              const dy = c.points[i][1] - c.points[j][1];
              if (dx*dx + dy*dy < maxDistSq) {
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

    // Increased star count to 12000. 
    // This provides enough density so the face can greedily consume 1500 local stars 
    // without creating a dark void / empty space in the background.
    const STAR_COUNT = 12000;
    
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
      // If hovering over the modal form itself, disperse the constellation
      if (e.target.closest('.auth-modal') || e.target.closest('.auth-modal-overlay')) {
        isHovering = false;
        return;
      }

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
        
        // 1. Pick stars uniformly from the background to prevent any dark voids
        shuffleArray(stars);
        
        // 2. To prevent stars from crossing paths chaotically, sort them physically left-to-right,
        // and sort the target points left-to-right. This creates a clean flowing animation.
        if (activeData && activeData.points) {
          const activeCount = activeData.points.length;
          const chosenStars = stars.slice(0, activeCount);
          chosenStars.sort((a, b) => a.x - b.x); // Sort stars by X
          
          const indices = Array.from({length: activeCount}, (_, i) => i);
          indices.sort((i, j) => activeData.points[i][0] - activeData.points[j][0]); // Sort points by X
          
          for (let k = 0; k < activeCount; k++) {
            stars[indices[k]] = chosenStars[k];
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
          
          shuffleArray(stars);
          
          if (activeData && activeData.points) {
            const activeCount = activeData.points.length;
            const chosenStars = stars.slice(0, activeCount);
            chosenStars.sort((a, b) => a.x - b.x); // Sort stars by X
            
            const indices = Array.from({length: activeCount}, (_, i) => i);
            indices.sort((i, j) => activeData.points[i][0] - activeData.points[j][0]); // Sort points by X
            
            for (let k = 0; k < activeCount; k++) {
              stars[indices[k]] = chosenStars[k];
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
        }

        // Interpolate position with fast, snappy spring physics
        const isFaceStar = isHovering && activeData && i < activeData.points.length;
        
        if (isFaceStar) {
          let dx = s.tx - s.x;
          let dy = s.ty - s.y;
          
          if (s.tx !== undefined && s.ty !== undefined) {
            // Временно убираем рандом (по просьбе из 16:05)
            s.x = s.tx;
            s.y = s.ty;
            s.vx = 0;
            s.vy = 0;
          } else {         
            // Maximally simple and smooth easing (no bounce, no spring twitching)
            s.x += dx * 0.15;
            s.y += dy * 0.15;
            s.vx = 0;
            s.vy = 0;
          }
        } else {
          // If star wrapped around screen, snap immediately so it doesn't fly across
          if (Math.abs(s.x - s.baseX) > width * 0.5) {
            s.x = s.baseX;
            s.y = s.baseY;
          }
          s.x += (s.baseX - s.x) * 0.25; // Scatter back to background much faster
          s.y += (s.baseY - s.y) * 0.25;
          s.vx = 0;
          s.vy = 0;
        }

        const tw = Math.sin(time * s.twinkle + s.offset) * 0.4 + 0.6;
        // Make the face stars significantly brighter
        const faceGlow = isFaceStar ? assemblyPhase * 0.7 : 0;
        const alpha = s.brightness * tw + faceGlow;

        ctx.beginPath();
        const radiusMult = 1 + (isFaceStar ? assemblyPhase * 0.8 : assemblyPhase * 0.2);
        const r = s.radius * radiusMult;
        ctx.fillStyle = `rgba(220, 230, 255, ${Math.min(1, alpha)})`;
        ctx.fillRect(s.x - r, s.y - r, r * 2, r * 2);
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
            // Calculate center of the constellation for vignette
            const cx_draw = cx;
            const cy_draw = cy;
            
            // Average position of the two stars forming the line
            const midX = (s1.x + s2.x) / 2;
            const midY = (s1.y + s2.y) / 2;
            
            // Normalize distance from center
            const size = Math.min(width, height) * 0.65;
            const drawW = size * (activeData.aspect || 1);
            const drawH = size;
            
            const nx = (midX - cx_draw) / (drawW / 2);
            const ny = (midY - cy_draw) / (drawH / 2);
            const distFromCenter = Math.sqrt(nx*nx + ny*ny);
            
            // Vignette: start fading out at 0.7 distance, completely invisible at 1.0
            let vignette = 1.0;
            if (distFromCenter > 0.7) {
              vignette = Math.max(0, 1.0 - (distFromCenter - 0.7) * 3.33); // 1.0 to 0.0 over 0.3 distance
            }
            
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.strokeStyle = `rgba(180, 210, 255, ${assemblyPhase * 0.4 * vignette})`; 
            ctx.lineWidth = 0.5;
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
