import React, { useState } from 'react';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { IconButton, TextField } from '@mui/material';

const CreateGroups = ({ onClose }) => {
  const [groupName, setGroupName] = useState('');  // State for the group name

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const handleCreateGroup = () => {
    if (groupName.trim() !== '') {
      // Logic to create the group
      console.log(`Group "${groupName}" created.`);
      onClose();  // Close the modal after creating the group
    } else {
      console.log('Please enter a group name.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 w-full max-w-sm">
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
      <IconButton
        color="primary"
        onClick={handleCreateGroup}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-md p-2"
        size="large"
      >
        <DoneOutlineIcon />
      </IconButton>
    </div>
  );
};

export default CreateGroups;
