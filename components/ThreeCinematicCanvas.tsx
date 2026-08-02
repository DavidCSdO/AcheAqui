"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCinematicCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    // Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    
    // Smooth Fog for depth of field
    scene.fog = new THREE.FogExp2(0x090812, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 40);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountNode.appendChild(renderer.domElement);

    // ─── 3D Lighting Setup ───
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const violetPointLight = new THREE.PointLight(0xa78bfa, 3, 100);
    violetPointLight.position.set(20, 20, 20);
    scene.add(violetPointLight);

    const pinkPointLight = new THREE.PointLight(0xf472b6, 2.5, 100);
    pinkPointLight.position.set(-20, -20, 10);
    scene.add(pinkPointLight);

    const cyanPointLight = new THREE.PointLight(0x38bdf8, 2, 80);
    cyanPointLight.position.set(0, 30, -10);
    scene.add(cyanPointLight);

    // ─── 3D Floating Particles Cloud ───
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 120;
      positions[i + 1] = (Math.random() - 0.5) * 120;
      positions[i + 2] = (Math.random() - 0.5) * 100 - 10;
      scales[i / 3] = Math.random() * 2 + 0.5;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Particle Texture Generator
    const createParticleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.3, "rgba(167, 139, 250, 0.8)");
        grad.addColorStop(0.8, "rgba(167, 139, 250, 0.1)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleMat = new THREE.PointsMaterial({
      size: 1.2,
      map: createParticleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ─── 3D Sketchfab-style Wireframe Hologram Objects ───
    const group3D = new THREE.Group();

    // 1. Central Holographic Icosahedron Node
    const icoGeo = new THREE.IcosahedronGeometry(8, 2);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0xa78bfa,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.4
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    icoMesh.position.set(22, 5, -15);
    group3D.add(icoMesh);

    // 2. Inner Glowing Core
    const coreGeo = new THREE.OctahedronGeometry(4, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0xf472b6,
      emissiveIntensity: 0.6
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    icoMesh.add(coreMesh);

    // 3. Floating Torus Ring
    const torusGeo = new THREE.TorusGeometry(14, 0.4, 16, 100);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.position.set(-25, -10, -20);
    group3D.add(torusMesh);

    scene.add(group3D);

    // ─── Mouse & Scroll Interactivity ───
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.0008;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.0008;
    };

    const handleScroll = () => {
      scrollY = window.scrollY || document.documentElement.scrollTop;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // ─── Animation Loop (60 FPS) ───
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Mouse Inertia
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Rotate Hologram Geometries
      icoMesh.rotation.x = elapsedTime * 0.15;
      icoMesh.rotation.y = elapsedTime * 0.2;
      coreMesh.rotation.x = -elapsedTime * 0.3;
      coreMesh.rotation.y = -elapsedTime * 0.4;
      torusMesh.rotation.x = elapsedTime * 0.1;
      torusMesh.rotation.z = elapsedTime * 0.15;

      // Wave motion for particle field
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        const y = posAttr.getY(i);
        posAttr.setY(i, y + Math.sin(elapsedTime + i) * 0.02);
      }
      posAttr.needsUpdate = true;

      // Scroll-driven Spatial Camera Translation
      camera.position.x = targetX * 15;
      camera.position.y = -targetY * 15 - (scrollY * 0.015);
      camera.position.z = 40 + Math.sin(scrollY * 0.002) * 5;

      camera.lookAt(0, -scrollY * 0.012, 0);

      // Light orbit
      violetPointLight.position.x = Math.sin(elapsedTime * 0.5) * 30;
      violetPointLight.position.z = Math.cos(elapsedTime * 0.5) * 30;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      if (mountNode && renderer.domElement) {
        mountNode.removeChild(renderer.domElement);
      }

      particleGeo.dispose();
      particleMat.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden" 
      aria-hidden="true"
    />
  );
}
