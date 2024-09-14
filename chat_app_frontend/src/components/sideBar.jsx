import React, { useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchIcon from '@mui/icons-material/Search';
import ConversationsItem from "./conversationsItem";
import CreateGroups from "./createGroups";
import { IconButton, TextField, InputAdornment, Modal, Box } from "@mui/material";

const SideBar = () => {
  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleCreateGroupOpen = () => setOpenCreateGroup(true);
  const handleCreateGroupClose = () => setOpenCreateGroup(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`min-h-full flex flex-col w-full space-y-4 transition-all duration-300 ease-in-out bg-transparent`}>
      {/* Icons Section */}
      <div className={`flex justify-between items-center p-4 transition-all duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} rounded-lg shadow-md`}>
        <IconButton className="hover:bg-gray-500 transition-all">
          <AccountCircleIcon fontSize="large" className={`${darkMode ? 'text-white' : 'text-black'}`} />
        </IconButton>
        <div className="flex space-x-4">
          <IconButton className="hover:bg-gray-500 transition-all">
            <PersonAddIcon className={`${darkMode ? 'text-white' : 'text-black'}`} />
          </IconButton>
          <IconButton className="hover:bg-gray-500 transition-all">
            <GroupAddIcon className={`${darkMode ? 'text-white' : 'text-black'}`} />
          </IconButton>
          <IconButton className="hover:bg-gray-500 transition-all" onClick={handleCreateGroupOpen}>
            <AddCircleOutlineIcon className={`${darkMode ? 'text-white' : 'text-black'}`} />
          </IconButton>
          <IconButton className="hover:bg-gray-500 transition-all" onClick={toggleDarkMode}>
            {darkMode ? (
              <LightModeIcon className="text-white" />
            ) : (
              <DarkModeIcon className="text-black" />
            )}
          </IconButton>
        </div>
      </div>

      {/* Search Section */}
      <div className={`p-4 transition-all duration-300 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-lg shadow-md`}>
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
            className: `rounded-full transition-all ${darkMode ? 'bg-gray-600 text-white' : 'bg-white text-white'}`, 
          }}
        />
      </div>

      {/* Conversations List */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} p-4 rounded-lg shadow-md`}>
        <ConversationsItem />
      </div>

      {/* Modal for creating group */}
      <Modal
        open={openCreateGroup}
        onClose={handleCreateGroupClose}
        aria-labelledby="create-group-modal"
        aria-describedby="modal-to-create-a-new-group"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: darkMode ? 'gray.800' : 'white',
            boxShadow: 24,
            p: 4,
            width: 400,
            borderRadius: 2,
          }}
          className="transition-all duration-300 ease-in-out"
        >
          <CreateGroups onClose={handleCreateGroupClose} />
        </Box>
      </Modal>
    </div>
  );
};

export default SideBar;
