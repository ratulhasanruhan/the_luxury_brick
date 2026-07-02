import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function BriqueCanvas() {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const meshRef = useRef(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    let renderer;
    let geometry;
    let material;
    let bumpTexture;
    let animationFrameId;
    let rotateTimeout;

    try {
      // Scene setup
      const scene = new THREE.Scene();
      scene.background = null; 

      // Camera setup
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10);
      camera.position.set(0, 0, 4.2);

      // WebGL Renderer Setup (can throw error if WebGL is disabled or missing)
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Create box geometry representing a premium brick
      geometry = new THREE.BoxGeometry(2.0, 0.62, 0.9);

      // Procedural noise bump map for standard clay texture
      const bumpCanvas = document.createElement('canvas');
      bumpCanvas.width = 256;
      bumpCanvas.height = 256;
      const ctx = bumpCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, 256, 256);
        
        // Add micro-bump noise for clay texture feel
        for (let i = 0; i < 15000; i++) {
          const x = Math.random() * 256;
          const y = Math.random() * 256;
          const gray = Math.floor(Math.random() * 64) + 96;
          ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
          ctx.fillRect(x, y, 1 + Math.random() * 1.5, 1 + Math.random() * 1.5);
        }
      }
      bumpTexture = new THREE.CanvasTexture(bumpCanvas);
      bumpTexture.wrapS = THREE.RepeatWrapping;
      bumpTexture.wrapT = THREE.RepeatWrapping;
      bumpTexture.repeat.set(2.5, 2.5);

      // Create physical material for high-end terracotta clay reflections
      material = new THREE.MeshPhysicalMaterial({
        color: 0xC0392B, // Terracotta Crimson Core
        roughness: 0.85,
        metalness: 0.1,
        clearcoat: 0.05,
        clearcoatRoughness: 0.8,
        bumpMap: bumpTexture,
        bumpScale: 0.025,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      
      // View angle tilting
      mesh.rotation.x = 0.35;
      mesh.rotation.y = 0.55;
      scene.add(mesh);
      meshRef.current = mesh;

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
      dirLight.position.set(5, 5, 4);
      dirLight.castShadow = true;
      scene.add(dirLight);

      // Dynamic warm rim light to accent the clay edges
      const rimLight = new THREE.PointLight(0xC0392B, 3.2, 8);
      rimLight.position.set(-4, -1, 3);
      scene.add(rimLight);

      const softFill = new THREE.PointLight(0xfff0e0, 1.5, 8);
      softFill.position.set(4, -2, 2);
      scene.add(softFill);

      let autoRotate = true;

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        if (meshRef.current && autoRotate) {
          meshRef.current.rotation.y += 0.0025;
        }

        renderer.render(scene, camera);
      };
      animate();
      setLoading(false);

      // Drag Rotate Handlers
      const handleMouseDown = (e) => {
        isDraggingRef.current = true;
        autoRotate = false;
        clearTimeout(rotateTimeout);
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        previousMousePositionRef.current = { x: clientX, y: clientY };
      };

      const handleMouseMove = (e) => {
        if (!isDraggingRef.current || !meshRef.current) return;
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        const deltaX = clientX - previousMousePositionRef.current.x;
        const deltaY = clientY - previousMousePositionRef.current.y;
        
        meshRef.current.rotation.y += deltaX * 0.007;
        meshRef.current.rotation.x += deltaY * 0.007;
        meshRef.current.rotation.x = Math.max(-0.9, Math.min(0.9, meshRef.current.rotation.x));
        previousMousePositionRef.current = { x: clientX, y: clientY };
      };

      const handleMouseUpOrLeave = () => {
        isDraggingRef.current = false;
        rotateTimeout = setTimeout(() => {
          autoRotate = true;
        }, 3000);
      };

      const handleWheel = (e) => {
        e.preventDefault();
        const zoomSpeed = 0.001;
        camera.position.z = Math.max(2.5, Math.min(5.5, camera.position.z + e.deltaY * zoomSpeed));
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
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight || 450;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
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
        if (material) material.dispose();
        if (bumpTexture) bumpTexture.dispose();
        if (renderer) renderer.dispose();
      };
    } catch (e) {
      console.warn("WebGL initialization failed, loading fallback 2D rendering:", e);
      setWebglSupported(false);
      setLoading(false);
    }
  }, []);

  if (!webglSupported) {
    // Beautiful static image fallback of the brick in a luxury glass container
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

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '400px' }}>
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
        bottom: '15px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '0.7rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.15em',
        pointerEvents: 'none',
        textAlign: 'center',
        background: 'rgba(6, 6, 6, 0.4)',
        padding: '4px 12px',
        borderRadius: '20px',
        backdropFilter: 'blur(4px)'
      }}>
        DRAG TO ROTATE  •  SCROLL TO ZOOM
      </div>
    </div>
  );
}
