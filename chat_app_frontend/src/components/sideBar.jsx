import React, { useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import CreateGroups from "./createGroups";
import AddFriend from "./addFriend";
import AddGroup from "./addGroup"; 
import { IconButton, TextField, InputAdornment, Modal, Box } from "@mui/material";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import ProfileModal from "./userProfilePopup"; // Import ProfileModal

const SideBar = () => {
  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const [openAddFriend, setOpenAddFriend] = useState(false);
  const [openAddGroup, setOpenAddGroup] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false); // New state for ProfileModal

  const handleCreateGroupOpen = () => setOpenCreateGroup(true);
  const handleCreateGroupClose = () => setOpenCreateGroup(false);

  const handleAddFriendOpen = () => setOpenAddFriend(true);
  const handleAddFriendClose = () => setOpenAddFriend(false);

  const handleAddGroupOpen = () => setOpenAddGroup(true);
  const handleAddGroupClose = () => setOpenAddGroup(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const resp = await axios.post('http://localhost:3000/logout', {}, {  
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (resp.status === 200 || resp.status === 201) { 
        localStorage.removeItem('token'); 
        console.log("User logged out successfully");
        navigate('/'); 
      } else {
        console.log("Error logging out");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Open Profile Modal
  const handleProfileModalOpen = () => setOpenProfileModal(true);
  const handleProfileModalClose = () => setOpenProfileModal(false);

  return (
    <motion.div 
      className={`min-h-full flex flex-col w-full space-y-4 bg-transparent`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Header Section with Icons */}
      <motion.div 
        className={`flex justify-between items-center p-4 rounded-lg shadow-lg transition-all duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}
        whileHover={{ scale: 1.02 }}
      >
        <IconButton className="hover:bg-gray-600 transition-all" onClick={handleProfileModalOpen}>
          <AccountCircleIcon fontSize="large" className={`${darkMode ? 'text-white' : 'text-black'}`} />
        </IconButton>
        <div className="flex space-x-4">
          <IconButton className="hover:bg-gray-600 transition-all" onClick={handleAddFriendOpen}>
            <PersonAddIcon className={`${darkMode ? 'text-white' : 'text-black'}`} />
          </IconButton>
          <IconButton className="hover:bg-gray-600 transition-all" onClick={handleAddGroupOpen}> 
            <GroupAddIcon className={`${darkMode ? 'text-white' : 'text-black'}`} />
          </IconButton>
          <IconButton className="hover:bg-gray-600 transition-all" onClick={handleCreateGroupOpen}>
            <AddCircleOutlineIcon className={`${darkMode ? 'text-white' : 'text-black'}`} />
          </IconButton>
          <IconButton className="hover:bg-gray-600 transition-all" onClick={handleLogout}>
            <LogoutIcon className={`${darkMode ? 'text-white' : 'text-black'}`} />
          </IconButton>
          <IconButton className="hover:bg-gray-600 transition-all" onClick={toggleDarkMode}>
            {darkMode ? (
              <LightModeIcon className="text-yellow-400" />
            ) : (
              <DarkModeIcon className="text-gray-700" />
            )}
          </IconButton>
        </div>
      </motion.div>

      {/* Search Section */}
      <motion.div 
        className={`p-4 rounded-lg shadow-md transition-all duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <TextField
          placeholder="Search..."
          variant="outlined"
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className={`${darkMode ? 'text-white' : 'text-black'}`} />
              </InputAdornment>
            ),
            className: `rounded-full transition-all ${darkMode ? 'bg-gray-600 text-white' : 'bg-white text-black'}`, 
          }}
        />
      </motion.div>

      {/* Profile Modal */}
      {openProfileModal && (
        <ProfileModal darkMode={darkMode} onClose={handleProfileModalClose} />
      )}

      {/* AddFriend Modal */}
      <Modal
        open={openAddFriend}
        onClose={handleAddFriendClose}
        aria-labelledby="add-friend-modal"
        aria-describedby="modal-to-add-a-new-friend"
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
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <AddFriend darkMode={darkMode} />
          </motion.div>
        </Box>
      </Modal>
      
      {/* AddGroup Modal */}
      <Modal
        open={openAddGroup}
        onClose={handleAddGroupClose}
        aria-labelledby="add-group-modal"
        aria-describedby="modal-to-add-a-new-group"
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
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <AddGroup darkMode={darkMode} />
          </motion.div>
        </Box>
      </Modal>
    </motion.div>
  );
};

export default SideBar;
