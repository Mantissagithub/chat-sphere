import React, { useEffect, useRef } from 'react';
import { TextField, Button } from '@mui/material';
import { gsap } from 'gsap';
import { loadFull } from 'tsparticles';
import Particles from 'react-tsparticles';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Shape Component with hover effects and distortion
const Shape = ({ position, color, shapeType }) => {
  const meshRef = useRef();

  // Rotate the shape continuously
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  // Handle hover effect
  const handlePointerOver = () => {
    gsap.to(meshRef.current.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.3 });
    gsap.to(meshRef.current.material.color, { r: Math.random(), g: Math.random(), b: Math.random() });
  };

  const handlePointerOut = () => {
    gsap.to(meshRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
    gsap.to(meshRef.current.material.color, { r: color.r, g: color.g, b: color.b });
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {shapeType === 'sphere' && <sphereGeometry args={[0.5, 32, 32]} />}
      {shapeType === 'box' && <boxGeometry args={[1, 1, 1]} />}
      {shapeType === 'cylinder' && <cylinderGeometry args={[0.5, 0.5, 1, 32]} />}
      {shapeType === 'torus' && <torusGeometry args={[0.5, 0.2, 16, 100]} />}
      {shapeType === 'cone' && <coneGeometry args={[0.5, 1, 32]} />}
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const WelcomePage = () => {
  const titleRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.1 }
    );
  }, []);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-100 text-gray-800 overflow-hidden">
      {/* Polygon.js Particles background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fpsLimit: 60,
          background: { color: '#000000' },
          particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff'] },
            shape: { type: ['circle', 'triangle', 'polygon'], polygon: { nb_sides: 5 } },
            opacity: { value: 0.5, random: true },
            size: { value: 10, random: true },
            move: {
              enable: true,
              speed: 4,
              direction: 'none',
              random: false,
              straight: false,
              out_mode: 'out',
              bounce: false,
              attract: { enable: true, rotateX: 600, rotateY: 1200 },
            },
          },
          interactivity: {
            events: {
              onhover: { enable: true, mode: 'repulse' },
              onclick: { enable: true, mode: 'push' },
              resize: true,
            },
            modes: {
              repulse: { distance: 100 },
              push: { particles_nb: 4 },
            },
          },
        }}
      />

      <Canvas className="absolute inset-0" style={{ zIndex: -1 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />

        {/* Render multiple shapes with unique colors and rotations */}
        <Shape position={[-3, 0, -5]} color={{ r: 1, g: 0, b: 0 }} shapeType="sphere" />
        <Shape position={[3, 0, -5]} color={{ r: 0, g: 1, b: 0 }} shapeType="box" />
        <Shape position={[0, 3, -5]} color={{ r: 0, g: 0, b: 1 }} shapeType="cylinder" />
        <Shape position={[0, -3, -5]} color={{ r: 1, g: 1, b: 0 }} shapeType="torus" />
        <Shape position={[-3, 3, -5]} color={{ r: 1, g: 0, b: 1 }} shapeType="cone" />
        <Shape position={[3, -3, -5]} color={{ r: 0, g: 1, b: 1 }} shapeType="cylinder" />
      </Canvas>

      <div className="relative z-10 flex w-full max-w-6xl rounded-lg overflow-hidden shadow-xl transform transition duration-500 hover:scale-105 bg-white bg-opacity-80 backdrop-blur-lg p-10">
        {/* Left Side - Image with gradient overlay */}
        <div className="w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1523848309072-c199db53f137?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black via-transparent to-transparent opacity-60"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-1/2 p-10 flex flex-col justify-center space-y-6">
          <h2 ref={titleRef} className="text-4xl font-bold text-center text-gray-800">Welcome Back</h2>
          <p className="text-center text-gray-500 mb-4">Sign in to continue</p>

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            className="mb-4"
            InputLabelProps={{ className: 'text-gray-600' }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            className="mb-4"
            InputLabelProps={{ className: 'text-gray-600' }}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md rounded-lg transition-all"
          >
            Login
          </Button>

          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-500 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
