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
// Removed TextField and InputAdornment from "@mui/material"
import { IconButton, Modal, Box } from "@mui/material";
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
      className={`min-h-full flex flex-col w-full space-y-4 p-3 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Header Section with Icons */}
      <motion.div
        className={`flex justify-between items-center p-3 rounded-xl shadow-lg transition-all duration-300 ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700'}`}
        whileHover={{ scale: 1.02 }}
      >
        <IconButton 
          className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
          onClick={handleProfileModalOpen}
        >
          <AccountCircleIcon fontSize="large" className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        </IconButton>
        <div className="flex space-x-2">
          <IconButton 
            className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
            onClick={handleAddFriendOpen}
          >
            <PersonAddIcon className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </IconButton>
          <IconButton 
            className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
            onClick={handleAddGroupOpen}
          >
            <GroupAddIcon className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </IconButton>
          <IconButton 
            className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
            onClick={handleCreateGroupOpen}
          >
            <AddCircleOutlineIcon className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </IconButton>
          <IconButton 
            className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
            onClick={handleLogout}
          >
            <LogoutIcon className={`${darkMode ? 'text-red-400' : 'text-red-500'}`} />
          </IconButton>
          <IconButton 
            className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <LightModeIcon className="text-yellow-400" />
            ) : (
              <DarkModeIcon className="text-gray-600" />
            )}
          </IconButton>
        </div>
      </motion.div>

      {/* Search Section */}
      <motion.div
        className={`p-3 rounded-xl shadow-md transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className={`w-full py-2 pl-10 pr-4 rounded-full border transition-all 
                        ${darkMode 
                            ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400' 
                            : 'bg-gray-100 text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500'} 
                        focus:outline-none focus:ring-2`}
          />
        </div>
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
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 rounded-lg shadow-xl
                      ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
        >
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <AddFriend darkMode={darkMode}  onClose={handleAddFriendClose}/>
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
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 rounded-lg shadow-xl
                      ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
        >
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <AddGroup darkMode={darkMode}  onClose={handleAddGroupClose} />
          </motion.div>
        </Box>
      </Modal>

      {/* CreateGroup Modal */}
      <Modal
        open={openCreateGroup}
        onClose={handleCreateGroupClose}
        aria-labelledby="create-group-modal"
        aria-describedby="modal-to-create-a-new-group"
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 rounded-lg shadow-xl
                      ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
        >
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <CreateGroups darkMode={darkMode} onClose={handleCreateGroupClose} />
          </motion.div>
        </Box>
      </Modal>
    </motion.div>
  );
};

export default SideBar;
