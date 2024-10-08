import React, { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import axios from 'axios';
import gsap from 'gsap';

const avatars = [
  'https://img.freepik.com/free-photo/3d-cartoon-back-school_23-2151676686.jpg?t=st=1727202872~exp=1727206472~hmac=e0ea544defb646c111d2c235ef00833cb3480e585275f869becf42d241f82630&w=1060',
  'https://img.freepik.com/premium-photo/3d-male-cartoon-character-thinking-about-something_1029473-774264.jpg?size=626&ext=jpg&ga=GA1.1.829029841.1727089904&semt=ais_hybrid',
  'https://img.freepik.com/premium-photo/lego-figure-man-with-glasses-yellow-jacket_1116403-2103.jpg?size=626&ext=jpg&ga=GA1.1.829029841.1727089904&semt=ais_hybrid'
];

const ProfileModal = ({ darkMode, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState(null); // State to hold selected avatar

  // Fetch user data from /me endpoint
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  // Randomly select an avatar on component mount
  useEffect(() => {
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    setAvatar(randomAvatar);
  }, []);

  // Animate on modal open
  useEffect(() => {
    if (userData) {
      gsap.fromTo('.avatar', { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.6 });
    }
  }, [userData]);

  if (!userData || !avatar) {
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
              src={avatar}
              alt="Avatar"
              className="rounded-full w-20 h-20 object-cover"
              style={{ borderRadius: '50%' }}
            />
          </motion.div>

          {/* User Details Section */}
          <div className="text-left">
            <h2 className="text-xl font-semibold">{userData.name}</h2>
            <p className="text-gray-600">{userData.email}</p>
            <p className="text-gray-600">Friends: {userData.friends.length}</p>
            <p className="text-gray-600">Groups: {userData.groups.length}</p>
          </div>
        </motion.div>
      </Box>
    </Modal>
  );
};

export default ProfileModal;
