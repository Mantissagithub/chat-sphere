import React, { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import axios from 'axios';
import gsap from 'gsap';

const ProfileModal = ({ darkMode, onClose }) => {
  const [userData, setUserData] = useState(null);

  // Fetch user data from /me endpoint
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  // Animate on modal open
  useEffect(() => {
    if (userData) {
      gsap.fromTo('.avatar', { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.6 });
    }
  }, [userData]);

  if (!userData) {
    return null;
  }

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="user-profile-modal"
      aria-describedby="modal-to-display-user-profile"
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: darkMode ? 'grey.900' : 'white',
          boxShadow: 24,
          p: 4,
          width: 400,
          borderRadius: 2,
        }}
      >
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {/* Avatar Section */}
          <motion.div className="avatar">
            <img
              src={userData.gender === 'male' ? '/male-avatar.png' : '/female-avatar.png'}
              alt="Avatar"
              className="rounded-full w-20 h-20"
            />
          </motion.div>

          {/* User Details Section */}
          <div className="text-left">
            <h2 className="text-xl font-semibold">
              {userData.name}
            </h2>
            <p className="text-gray-600">
              {userData.email}
            </p>
            <p className="text-gray-600">
              Friends: {userData.friends.length}
            </p>
            <p className="text-gray-600">
              Groups: {userData.groups.length}
            </p>
          </div>
        </motion.div>
      </Box>
    </Modal>
  );
};

export default ProfileModal;
