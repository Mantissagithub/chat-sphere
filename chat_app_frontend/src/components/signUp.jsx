import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import axios from 'axios'; // Import axios
import { useNavigate } from 'react-router-dom';

const images = [
  'https://media.istockphoto.com/id/480336296/photo/tracked-excavators.jpg?s=2048x2048&w=is&k=20&c=UKB4a0hylVCaKL_Qz29J8xZVuUVkF8b4u3n_w1OQOQs=',
  'https://plus.unsplash.com/premium_photo-1661951710685-a676c4190c19?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1622645636770-11fbf0611463?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

const SignUp = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const navigate = useNavigate();

  // Form state for user signup
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState(null);

  // Background image switcher with GSAP animations
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % images.length);
      gsap.to(".background", {
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.to(".background", { opacity: 1, duration: 1.5 });
        }
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make the API call to backend using Axios
    try {
      const response = await axios.post('http://localhost:3000/signup', formData);
      console.log('Signup successful:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error during signup:', error.response?.data);
      setError(error.response?.data.message || 'Something went wrong');
    }
  };

  return (
    <div
      className="relative flex items-center justify-center h-screen bg-transparent text-gray-800 overflow-hidden"
      style={{
        backgroundImage: `url(${images[currentBg]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 2s ease-in-out',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

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
        className="relative z-10 flex flex-col md:flex-row w-full max-w-6xl rounded-lg overflow-hidden shadow-xl bg-white bg-opacity-80 backdrop-blur-lg p-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
      >
        <div className="w-full md:w-1/2 relative">
          <motion.img
            src="https://media.istockphoto.com/id/480336296/photo/tracked-excavators.jpg?s=2048x2048&w=is&k=20&c=UKB4a0hylVCaKL_Qz29J8xZVuUVkF8b4u3n_w1OQOQs="
            alt="Background"
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-60"></div>
        </div>

        <motion.div
          className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center space-y-6"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="text-4xl font-bold text-center text-gray-800">Create an Account</h2>
          <p className="text-center text-gray-500 mb-4">
            Join us and explore new possibilities
          </p>

          {error && <p className="text-red-600 text-center">{error}</p>}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="mb-4"
              InputLabelProps={{ className: 'text-gray-600' }}
            />

            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mb-4"
              InputLabelProps={{ className: 'text-gray-600' }}
            />

            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="mb-4"
              InputLabelProps={{ className: 'text-gray-600' }}
            />

            <TextField
              label="Confirm Password"
              variant="outlined"
              fullWidth
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mb-6"
              InputLabelProps={{ className: 'text-gray-600' }}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              className="py-3 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md rounded-lg transition-all"
            >
              Sign Up
            </Button>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/" className="text-blue-500 hover:underline">
                Login
              </a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignUp;
