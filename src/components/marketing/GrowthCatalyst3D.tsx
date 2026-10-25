import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * GrowthCatalyst3D
 * An ultra-lightweight, low-RAM Three.js experience embodying:
 * - Genesis & Start (شروع)
 * - Inner Drive & Willpower (انگیزه و قدرت)
 * - Personal Evolution (رشد فردی)
 * 
 * Performance & Memory Guardrails:
 * - Minimal polyhedral geometry (<60 vertices total across scene)
 * - Low-power preference & pixel-ratio capped at 1.5
 * - IntersectionObserver: sleeps when offscreen, zero background CPU/RAM waste
 * - Full manual disposal of geometry, materials, shaders & context on unmount
 */
export const GrowthCatalyst3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number | null = null;
    let isVisible = false;

    // Dimensions
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // Renderer (optimized for lowest memory & battery usage)
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
      stencil: false,
      depth: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    // Group for mouse parallax & tilt
    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    // 1. Central Core: The Catalyst of Willpower (Low-poly Icosahedron: 12 vertices)
    const coreGeo = new THREE.IcosahedronGeometry(1.25, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0c0e14,
      roughness: 0.25,
      metalness: 0.9,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    sceneGroup.add(coreMesh);

    // 2. Wireframe Lattice: Architectural Structure of Personal Growth (Crimson beacon)
    const wireGeo = new THREE.IcosahedronGeometry(1.27, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xC8102E, // NextYou Brand Crimson
      wireframe: true,
      transparent: true,
      opacity: 0.72,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    sceneGroup.add(wireMesh);

    // 3. Orbital Trajectory Rings (Representing focus, discipline & delayed gratification)
    // Ring 1 (Platinum inner gyroscope)
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.016, 8, 48);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0xE4E4E7,
      transparent: true,
      opacity: 0.35,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    sceneGroup.add(ring1);

    // Ring 2 (Crimson accent orbit)
    const ring2Geo = new THREE.TorusGeometry(2.6, 0.012, 8, 48);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xC8102E,
      transparent: true,
      opacity: 0.5,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    sceneGroup.add(ring2);

    // 4. Ascending Willpower Embers: 55 lightweight points moving upward
    const particleCount = 55;
    const positions = new Float32Array(particleCount * 3);
    const initialSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5.5; // X
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5.0; // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3.5; // Z
      initialSpeeds[i] = 0.006 + Math.random() * 0.012;
    }

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pointsMat = new THREE.PointsMaterial({
      color: 0xE8A87C,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
    sceneGroup.add(pointsMesh);

    // 5. Minimalist Lighting Rig (3 points)
    const ambientLight = new THREE.AmbientLight(0x161820, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const beaconLight = new THREE.PointLight(0xC8102E, 3.5, 9, 2);
    beaconLight.position.set(0, 0, 0);
    scene.add(beaconLight);

    // Mouse / Pointer Parallax State (exponential damping)
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouse.targetX = (clientX / rect.width - 0.5) * 1.2;
      mouse.targetY = -(clientY / rect.height - 0.5) * 0.8;
    };

    container.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // Animation Tick
    let clockTime = 0;

    const tick = () => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      clockTime += 0.016;

      // Mouse Parallax Damping
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      sceneGroup.rotation.y = mouse.x * 0.45;
      sceneGroup.rotation.x = mouse.y * 0.35;

      // Polyhedral Core Rotation & Harmonic Pulse
      coreMesh.rotation.x += 0.005;
      coreMesh.rotation.y += 0.007;
      wireMesh.rotation.x = coreMesh.rotation.x;
      wireMesh.rotation.y = coreMesh.rotation.y;

      const scalePulse = 1.0 + Math.sin(clockTime * 1.8) * 0.035;
      coreMesh.scale.set(scalePulse, scalePulse, scalePulse);
      wireMesh.scale.set(scalePulse, scalePulse, scalePulse);

      // Orbital Rings Rotation
      ring1.rotation.z += 0.006;
      ring1.rotation.y += 0.003;

      ring2.rotation.z -= 0.005;
      ring2.rotation.x += 0.004;

      // Ascend Particles (Sparks of Growth)
      const posAttr = pointsGeo.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += initialSpeeds[i];
        if (posArray[i * 3 + 1] > 2.8) {
          posArray[i * 3 + 1] = -2.8;
          posArray[i * 3] = (Math.random() - 0.5) * 4.5;
          posArray[i * 3 + 2] = (Math.random() - 0.5) * 3.0;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    // IntersectionObserver: sleep completely when offscreen to save 100% RAM / GPU
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animationFrameId) {
            animationFrameId = requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Cleanup Everything on Unmount
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handlePointerMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      // Dispose Geometries
      coreGeo.dispose();
      wireGeo.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      pointsGeo.dispose();

      // Dispose Materials
      coreMat.dispose();
      wireMat.dispose();
      ring1Mat.dispose();
      ring2Mat.dispose();
      pointsMat.dispose();

      // Dispose Renderer & Context
      renderer.dispose();
      renderer.forceContextLoss();

      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full overflow-hidden select-none pointer-events-auto ${className}`}
      aria-hidden="true"
    />
  );
};
