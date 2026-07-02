import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// ── PROCEDURAL TEXTURE GENERATORS ──

// Generate fine-grit clay/silt bump map
const createBumpTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);
    
    for (let i = 0; i < 20000; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const gray = Math.floor(Math.random() * 40) + 108;
      ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
      ctx.fillRect(x, y, 1 + Math.random(), 1 + Math.random());
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
};

// Generate standard side texture with color variations/flecks
const createColorTexture = (finish) => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  if (finish === 'standard') {
    ctx.fillStyle = '#C0392B';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#B03020';
    for (let i = 0; i < 15; i++) {
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 30, 30);
    }
  } else if (finish === 'executive') {
    ctx.fillStyle = '#18181B';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#8A6F3E';
    for (let i = 0; i < 1000; i++) {
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 1.2, 1.2);
    }
  } else if (finish === 'sotheby') {
    ctx.fillStyle = '#9B2335';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = 'rgba(200, 169, 110, 0.45)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      let x = Math.random() * 256;
      ctx.moveTo(x, 0);
      for (let y = 0; y < 256; y += 12) {
        x += (Math.random() - 0.5) * 8;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
};

// Generate front face texture featuring the embossed B R I Q U E logo & unique serial
const createFrontTexture = (finish, serial) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  if (finish === 'standard') {
    ctx.fillStyle = '#C0392B';
    ctx.fillRect(0, 0, 512, 160);
    ctx.fillStyle = '#B03020';
    for (let i = 0; i < 30; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 160, 40, 40);
    }
  } else if (finish === 'executive') {
    ctx.fillStyle = '#18181B';
    ctx.fillRect(0, 0, 512, 160);
    ctx.fillStyle = '#8A6F3E';
    for (let i = 0; i < 2000; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 160, 1.2, 1.2);
    }
  } else if (finish === 'sotheby') {
    ctx.fillStyle = '#9B2335';
    ctx.fillRect(0, 0, 512, 160);
    
    ctx.strokeStyle = 'rgba(200, 169, 110, 0.45)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      let x = Math.random() * 512;
      ctx.moveTo(x, 0);
      for (let y = 0; y < 160; y += 8) {
        x += (Math.random() - 0.5) * 10;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  if (finish === 'standard') {
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.font = 'bold 36px Cormorant Garamond, serif';
    ctx.fillText('B R I Q U E', 256 + 1.2, 60 + 1.2);
    ctx.fillStyle = '#8A251A';
    ctx.fillText('B R I Q U E', 256, 60);
  } else if (finish === 'executive') {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.font = 'bold 38px Cormorant Garamond, serif';
    ctx.fillText('B R I Q U E', 256 + 1.5, 60 + 1.5);
    ctx.fillStyle = '#C8A96E';
    ctx.fillText('B R I Q U E', 256, 60);
  } else if (finish === 'sotheby') {
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.font = '600 40px Cormorant Garamond, serif';
    ctx.fillText('B R I Q U E', 256 + 1.5, 60 + 1.5);
    const grad = ctx.createLinearGradient(180, 0, 330, 0);
    grad.addColorStop(0, '#EDE0C8');
    grad.addColorStop(0.4, '#C8A96E');
    grad.addColorStop(1, '#8A6F3E');
    ctx.fillStyle = grad;
    ctx.fillText('B R I Q U E', 256, 60);
  }

  const defaultSerial = finish === 'sotheby' ? 'SERIAL #018 / 050' : 
                        finish === 'executive' ? 'SERIAL #118 / 200' : 
                        'SERIAL #642 / 999';
  const serialText = serial || defaultSerial;
  
  ctx.font = '500 11px JetBrains Mono, monospace';
  ctx.letterSpacing = '3px';
  
  if (finish === 'standard') {
    ctx.fillStyle = '#A33C30';
  } else if (finish === 'executive') {
    ctx.fillStyle = '#8E8E93';
  } else if (finish === 'sotheby') {
    ctx.fillStyle = '#EDE0C8';
  }
  
  ctx.fillText(serialText, 256, 110);

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
};

// Lerp math helper
const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

export default function BriqueCanvas({ finish = 'executive', serialNumber, scrollChoreography = true }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const meshRef = useRef(null);
  const containerGroupRef = useRef(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use full window sizes for choreographed viewport
    const width = scrollChoreography ? window.innerWidth : container.clientWidth;
    const height = scrollChoreography ? window.innerHeight : (container.clientHeight || 450);

    let renderer;
    let geometry;
    let sideTex;
    let frontTex;
    let bumpTex;
    let materials = [];
    let brickContainer;
    let animationFrameId;
    let rotateTimeout;
    let scrollY = window.scrollY;

    try {
      // Scene
      const scene = new THREE.Scene();
      scene.background = null; 

      // Camera
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 20);
      camera.position.set(0, 0, 7.0);

      // WebGL Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;
      
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Single parent group to carry both the brick and pedestal through sections
      brickContainer = new THREE.Group();
      scene.add(brickContainer);
      containerGroupRef.current = brickContainer;

      // Box geometry representing the B R I Q U E monolith
      geometry = new THREE.BoxGeometry(2.15, 0.65, 1.025);

      // Instantiating textures
      sideTex = createColorTexture(finish);
      frontTex = createFrontTexture(finish, serialNumber);
      bumpTex = createBumpTexture();

      // Configure high-end PBR materials matching selected finishes
      const roughnessVal = finish === 'standard' ? 0.9 : finish === 'executive' ? 0.32 : 0.22;
      const metalnessVal = finish === 'standard' ? 0.05 : finish === 'executive' ? 0.4 : 0.15;
      const clearcoatVal = finish === 'standard' ? 0.0 : finish === 'executive' ? 0.65 : 1.0;
      const clearcoatRoughnessVal = finish === 'executive' ? 0.22 : 0.08;

      const sideMat = new THREE.MeshPhysicalMaterial({
        map: sideTex,
        bumpMap: bumpTex,
        bumpScale: finish === 'standard' ? 0.02 : 0.006,
        roughness: roughnessVal,
        metalness: metalnessVal,
        clearcoat: clearcoatVal,
        clearcoatRoughness: clearcoatRoughnessVal,
        side: THREE.DoubleSide
      });

      const frontMat = new THREE.MeshPhysicalMaterial({
        map: frontTex,
        bumpMap: bumpTex,
        bumpScale: finish === 'standard' ? 0.02 : 0.006,
        roughness: roughnessVal,
        metalness: metalnessVal,
        clearcoat: clearcoatVal,
        clearcoatRoughness: clearcoatRoughnessVal,
        side: THREE.DoubleSide
      });

      // Mapping 6 cube faces: [right, left, top, bottom, front, back]
      // Index 4 is the front face
      for (let i = 0; i < 6; i++) {
        materials.push(i === 4 ? frontMat : sideMat);
      }

      const mesh = new THREE.Mesh(geometry, materials);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      brickContainer.add(mesh);
      meshRef.current = mesh;

      // Lighting Setup
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
      dirLight.position.set(5, 12, 7);
      dirLight.castShadow = true;
      scene.add(dirLight);

      const rimColor = finish === 'sotheby' ? 0xC8A96E : finish === 'executive' ? 0x9B2335 : 0xC0392B;
      const rimLight = new THREE.PointLight(rimColor, 4.0, 10);
      rimLight.position.set(-6, 2, 5);
      scene.add(rimLight);

      const softFill = new THREE.PointLight(0xfff0e0, 1.5, 8);
      softFill.position.set(4, -3, 3);
      scene.add(softFill);

      let autoRotate = true;
      let baseRotY = -0.5;

      const handleScroll = () => {
        scrollY = window.scrollY;
      };

      if (scrollChoreography) {
        window.addEventListener('scroll', handleScroll, { passive: true });
      }

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        const time = performance.now() * 0.001;

        if (brickContainer) {
          // Slow base rotation over time
          if (autoRotate) {
            baseRotY += 0.0022;
          }

          if (scrollChoreography) {
            // Find section DOM elements
            const homeEl = document.getElementById('home');
            const customizerEl = document.getElementById('customizer');
            const pedigreeEl = document.getElementById('pedigree');
            const speculateEl = document.getElementById('speculate');
            const galleryEl = document.getElementById('gallery');

            const customizerTop = customizerEl ? customizerEl.offsetTop : 800;
            const pedigreeTop = pedigreeEl ? pedigreeEl.offsetTop : 1650;
            const speculateTop = speculateEl ? speculateEl.offsetTop : 2550;
            const galleryTop = galleryEl ? galleryEl.offsetTop : 3400;

            let targetScreenX = window.innerWidth * 0.75;
            let targetScreenY = window.innerHeight * 0.5;
            let targetZ = 0;
            let targetRotX = 0.35;
            let targetRotY = -0.55;
            let targetScale = 1.0;

            const isMobile = window.innerWidth < 768;

            if (scrollY < customizerTop) {
              // Section 1: Hero -> Customizer
              const t = Math.max(0, Math.min(1, scrollY / customizerTop));
              if (isMobile) {
                targetScreenX = window.innerWidth * 0.5;
                targetScreenY = lerp(window.innerHeight * 0.65, window.innerHeight * 0.32, t);
                targetScale = lerp(0.85, 0.75, t);
              } else {
                targetScreenX = lerp(window.innerWidth * 0.72, window.innerWidth * 0.265, t);
                targetScreenY = lerp(window.innerHeight * 0.5, window.innerHeight * 0.44, t);
                targetScale = lerp(1.0, 0.95, t);
              }
              targetZ = 0;
              targetRotX = lerp(0.35, 0.25, t);
              targetRotY = lerp(-0.55, 1.25, t);
            } 
            else if (scrollY < pedigreeTop) {
              // Section 2: Customizer -> Pedigree (Specs)
              const t = Math.max(0, Math.min(1, (scrollY - customizerTop) / (pedigreeTop - customizerTop)));
              if (isMobile) {
                targetScreenX = window.innerWidth * 0.5;
                targetScreenY = lerp(window.innerHeight * 0.32, window.innerHeight * 0.45, t);
                targetZ = lerp(0, -0.5, t);
                targetScale = lerp(0.75, 0.75, t);
              } else {
                targetScreenX = lerp(window.innerWidth * 0.265, window.innerWidth * 0.72, t);
                targetScreenY = lerp(window.innerHeight * 0.44, window.innerHeight * 0.52, t);
                targetZ = lerp(0, -0.6, t);
                targetScale = lerp(0.95, 0.88, t);
              }
              targetRotX = lerp(0.25, 0.45, t);
              targetRotY = lerp(1.25, 0.4, t);
            } 
            else if (scrollY < speculateTop) {
              // Section 3: Pedigree -> Speculate (Slingshot Game)
              const t = Math.max(0, Math.min(1, (scrollY - pedigreeTop) / (speculateTop - pedigreeTop)));
              if (isMobile) {
                targetScreenX = window.innerWidth * 0.5;
                targetScreenY = lerp(window.innerHeight * 0.45, window.innerHeight * 0.22, t);
                targetZ = lerp(-0.5, -4.5, t);
                targetScale = lerp(0.75, 0.55, t);
              } else {
                targetScreenX = lerp(window.innerWidth * 0.72, window.innerWidth * 0.5, t);
                targetScreenY = lerp(window.innerHeight * 0.52, window.innerHeight * 0.26, t);
                targetZ = lerp(-0.6, -4.5, t);
                targetScale = lerp(0.88, 0.62, t);
              }
              targetRotX = lerp(0.45, 0.4, t);
              targetRotY = lerp(0.4, 0.0, t);
            } 
            else {
              // Section 4: Speculate -> Gallery and Footer
              const t = Math.max(0, Math.min(1, (scrollY - speculateTop) / (galleryTop - speculateTop)));
              targetScreenX = window.innerWidth * 0.5;
              if (isMobile) {
                targetScreenY = lerp(window.innerHeight * 0.22, window.innerHeight * 0.15, t);
              } else {
                targetScreenY = lerp(window.innerHeight * 0.26, window.innerHeight * 0.12, t);
              }
              targetZ = lerp(-4.5, -6.5, t);
              targetRotX = lerp(0.4, 0.35, t);
              targetRotY = lerp(0.0, -0.55, t);
              targetScale = lerp(0.62, 0.4, t);
            }

            // Convert target screen coordinates to Three.js coordinates on the z=0 plane
            const ndcX = (targetScreenX / window.innerWidth) * 2 - 1;
            const ndcY = -(targetScreenY / window.innerHeight) * 2 + 1;
            
            const vec = new THREE.Vector3(ndcX, ndcY, 0.5);
            vec.unproject(camera);
            vec.sub(camera.position).normalize();
            const distance = -camera.position.z / vec.z;
            const targetX = camera.position.x + vec.x * distance;
            const targetY = camera.position.y + vec.y * distance;

            // Lerp container positions smoothly
            brickContainer.position.x += (targetX - brickContainer.position.x) * 0.095;
            brickContainer.position.y += (targetY - brickContainer.position.y) * 0.095;
            brickContainer.position.z += (targetZ - brickContainer.position.z) * 0.095;
            brickContainer.scale.setScalar(lerp(brickContainer.scale.x, targetScale, 0.095));

            // Accumulate rotation transitions
            if (autoRotate) {
              brickContainer.rotation.y = baseRotY + targetRotY;
            } else {
              baseRotY = brickContainer.rotation.y - targetRotY;
            }
            brickContainer.rotation.x += (targetRotX - brickContainer.rotation.x) * 0.095;
          } else {
            // Static local rotation if scrollChoreography is false
            if (autoRotate) {
              brickContainer.rotation.y = baseRotY;
            }
          }

          // Local levitating floating oscillation on the brick mesh (leaves pedestal stationary)
          if (meshRef.current) {
            const floatOffset = Math.sin(time * 1.6) * 0.04;
            meshRef.current.position.y = floatOffset;
          }
        }

        renderer.render(scene, camera);
      };

      animate();
      setLoading(false);

      // Drag-rotate handlers (toggled when clicking the brick)
      const handleMouseDown = (e) => {
        isDraggingRef.current = true;
        autoRotate = false;
        clearTimeout(rotateTimeout);
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        previousMousePositionRef.current = { x: clientX, y: clientY };
      };

      const handleMouseMove = (e) => {
        if (!isDraggingRef.current || !brickContainer) return;
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        const deltaX = clientX - previousMousePositionRef.current.x;
        const deltaY = clientY - previousMousePositionRef.current.y;
        
        // Rotate container directly on drag
        brickContainer.rotation.y += deltaX * 0.0075;
        brickContainer.rotation.x += deltaY * 0.0075;
        brickContainer.rotation.x = Math.max(-0.95, Math.min(0.95, brickContainer.rotation.x));
        previousMousePositionRef.current = { x: clientX, y: clientY };
      };

      const handleMouseUpOrLeave = () => {
        isDraggingRef.current = false;
        rotateTimeout = setTimeout(() => {
          autoRotate = true;
        }, 3000);
      };

      const handleWheel = (e) => {
        if (!scrollChoreography) {
          e.preventDefault();
          const zoomSpeed = 0.0012;
          camera.position.z = Math.max(2.6, Math.min(5.4, camera.position.z + e.deltaY * zoomSpeed));
        }
      };

      const el = renderer.domElement;
      el.addEventListener('mousedown', handleMouseDown);
      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseup', handleMouseUpOrLeave);
      el.addEventListener('mouseleave', handleMouseUpOrLeave);
      el.addEventListener('wheel', handleWheel, { passive: false });
      el.addEventListener('touchstart', handleMouseDown, { passive: true });
      el.addEventListener('touchmove', handleMouseMove, { passive: true });
      el.addEventListener('touchend', handleMouseUpOrLeave);

      const handleResize = () => {
        if (!containerRef.current || !rendererRef.current) return;
        const w = scrollChoreography ? window.innerWidth : containerRef.current.clientWidth;
        const h = scrollChoreography ? window.innerHeight : (containerRef.current.clientHeight || 450);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        if (scrollChoreography) {
          window.removeEventListener('scroll', handleScroll);
        }
        clearTimeout(rotateTimeout);
        if (el) {
          el.removeEventListener('mousedown', handleMouseDown);
          el.removeEventListener('mousemove', handleMouseMove);
          el.removeEventListener('mouseup', handleMouseUpOrLeave);
          el.removeEventListener('mouseleave', handleMouseUpOrLeave);
          el.removeEventListener('wheel', handleWheel);
          el.removeEventListener('touchstart', handleMouseDown);
          el.removeEventListener('touchmove', handleMouseMove);
          el.removeEventListener('touchend', handleMouseUpOrLeave);
        }
        if (container && renderer.domElement) {
          container.removeChild(renderer.domElement);
        }
        if (geometry) geometry.dispose();
        if (sideTex) sideTex.dispose();
        if (frontTex) frontTex.dispose();
        if (bumpTex) bumpTex.dispose();
        materials.forEach(mat => mat.dispose());
        pedestalGroup.traverse(child => {
          if (child.isMesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(m => m.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
        if (renderer) renderer.dispose();
      };
    } catch (e) {
      console.warn("WebGL initialization failed, loading fallback 2D rendering:", e);
      setWebglSupported(false);
      setLoading(false);
    }
  }, [finish, serialNumber, scrollChoreography]);

  if (!webglSupported) {
    return (
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%', 
        minHeight: '400px',
        backgroundImage: 'url(/assets/brique_gallery_1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '12px',
        border: '1px solid var(--border-gold)'
      }}>
        <div style={{
          position: 'absolute',
          bottom: '15px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.7rem',
          color: 'var(--text-white)',
          letterSpacing: '0.15em',
          pointerEvents: 'none',
          textAlign: 'center',
          background: 'rgba(6, 6, 6, 0.65)',
          padding: '4px 12px',
          borderRadius: '20px',
          backdropFilter: 'blur(4px)'
        }}>
          CLASSIC RED BRIQUE (2D STATIC MODE)
        </div>
      </div>
    );
  }

  // Set class based on scrollChoreography mode
  const containerClass = scrollChoreography ? 'fixed-canvas-container' : '';

  return (
    <div className={containerClass} style={scrollChoreography ? {} : { position: 'relative', width: '100%', height: '100%', minHeight: '400px' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#ffffff',
          fontFamily: 'var(--font-sans)',
          letterSpacing: '0.2em',
          fontSize: '0.9rem',
          background: 'var(--bg-darker)'
        }}>
          MATERIALIZING BRIQUE...
        </div>
      )}
      <div ref={containerRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
      <div style={{
        position: 'absolute',
        bottom: '25px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '0.65rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.15em',
        pointerEvents: 'none',
        textAlign: 'center',
        background: 'rgba(6, 6, 6, 0.45)',
        padding: '5px 14px',
        borderRadius: '20px',
        backdropFilter: 'blur(4px)',
        zIndex: 5
      }}>
        DRAG BACKGROUND TO ROTATE
      </div>
    </div>
  );
}
