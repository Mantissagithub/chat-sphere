import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const images = [
  'https://media.istockphoto.com/id/480336296/photo/tracked-excavators.jpg?s=2048x2048&w=is&k=20&c=UKB4a0hylVCaKL_Qz29J8xZVuUVkF8b4u3n_w1OQOQs=',
  'https://plus.unsplash.com/premium_photo-1661951710685-a676c4190c19?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1622645636770-11fbf0611463?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', {
        email,
        password
      });

      if (response.status === 200) {
        console.log('Login successful:', response.data);
        localStorage.setItem('token', response.data.token);

        navigate('/chat');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Error during login. Please try again.');
      console.error(err);
    }
  };

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div
      className="relative flex items-center justify-center h-screen bg-black text-gray-800 overflow-hidden"
      style={{
        backgroundImage: `url(${images[0]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 2s ease-in-out',
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fpsLimit: 60,
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

      <motion.div
        className="relative z-10 flex w-full max-w-6xl rounded-lg overflow-hidden shadow-xl transform transition duration-500 hover:scale-105 bg-white bg-opacity-80 backdrop-blur-lg p-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Left Side - Image with gradient overlay */}
        <div className="w-1/2 relative">
          <motion.img
            src="https://images.unsplash.com/photo-1523848309072-c199db53f137?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Left Background"
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black via-transparent to-transparent opacity-60"></div>
        </div>

        {/* Right Side - Login Form */}
        <motion.div
          className="w-1/2 p-10 flex flex-col justify-center space-y-6"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <h2 className="text-4xl font-bold text-center text-gray-800">Welcome Back</h2>
          <p className="text-center text-gray-500 mb-4">Sign in to continue</p>

          {error && <p className="text-center text-red-500">{error}</p>}

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            className="mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ className: 'text-gray-600' }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            className="mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ className: 'text-gray-600' }}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md rounded-lg transition-all"
            onClick={handleLogin}
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
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
