import React from 'react';
import { TextField, Button } from '@mui/material';

const SignUp = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-800">
      <div className="flex w-full max-w-7xl rounded-lg overflow-hidden shadow-xl transform transition duration-500 hover:scale-105">
        
        {/* Left Side - Image with gradient overlay */}
        <div className="w-1/2 relative">
          <img 
            src="https://media.istockphoto.com/id/480336296/photo/tracked-excavators.jpg?s=2048x2048&w=is&k=20&c=UKB4a0hylVCaKL_Qz29J8xZVuUVkF8b4u3n_w1OQOQs=" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black via-transparent to-transparent opacity-60"></div> {/* Gradient overlay */}
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-1/2 bg-white p-10 flex flex-col justify-center space-y-6">
          <h2 className="text-4xl font-bold text-center text-gray-800">Create an Account</h2>
          <p className="text-center text-gray-500 mb-4">
            Join us and explore new possibilities
          </p>

          {/* Name Input */}
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            className="mb-4"
            InputLabelProps={{ className: 'text-gray-600' }}
          />

          {/* Email Input */}
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            className="mb-4"
            InputLabelProps={{ className: 'text-gray-600' }}
          />

          {/* Password Input */}
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            className="mb-4"
            InputLabelProps={{ className: 'text-gray-600' }}
          />

          {/* Confirm Password Input */}
          <TextField
            label="Confirm Password"
            variant="outlined"
            fullWidth
            type="password"
            className="mb-6"
            InputLabelProps={{ className: 'text-gray-600' }}
          />

          {/* Sign Up Button */}
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth
            className="py-3 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md rounded-lg transition-all"
          >
            Sign Up
          </Button>

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account? <a href="/" className="text-blue-500 hover:underline">Login</a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignUp;
