// CreateGroups.jsx
import React, { useState } from'react';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { IconButton, TextField } from '@mui/material';
import { motion } from 'framer-motion';

const CreateGroups = ({ onClose }) => {
  const [groupName, setGroupName] = useState('');  // State for the group name

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const handleCreateGroup = () => {
    if (groupName.trim()!== '') {
      // Logic to create the group
      console.log(`Group "${groupName}" created.`);
      onClose();  // Close the modal after creating the group
    } else {
      console.log('Please enter a group name.');
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 w-full max-w-sm"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Group name input */}
      <TextField
        variant="outlined"
        placeholder="Enter group name"
        fullWidth
        size="small"
        value={groupName}
        onChange={handleGroupNameChange}
        className="bg-gray-50 rounded-md"
        InputProps={{
          className: 'text-gray-700'
        }}
      />
      
      {/* Submit button */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.95, rotate: -10 }}
      >
        <IconButton
          color="primary"
          onClick={handleCreateGroup}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-md p-2"
          size="large"
        >
          <DoneOutlineIcon />
        </IconButton>
      </motion.div>
    </motion.div>
  );
};

export default CreateGroups;