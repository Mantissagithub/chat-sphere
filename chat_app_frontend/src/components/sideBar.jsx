import React from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SearchIcon from '@mui/icons-material/Search';
import ConversationsItem from "./conversationsItem";
import { IconButton, TextField, InputAdornment } from "@mui/material";

const SideBar = () => {
  return (
    <div className="min-h-full flex flex-col w-full space-y-4"> {/* Sidebar container with space between sections */}
      {/* Icons Section */}
      <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg shadow-sm mb-2 text-white"> {/* Dark section with white icons */}
        <IconButton>
          <AccountCircleIcon fontSize="large" className="text-white"/>
        </IconButton>
        <div className="flex space-x-4">
          <IconButton className="text-white">
            <PersonAddIcon />
          </IconButton>
          <IconButton className="text-white">
            <GroupAddIcon />
          </IconButton>
          <IconButton className="text-white">
            <AddCircleOutlineIcon />
          </IconButton>
          <IconButton className="text-white">
            <DarkModeIcon />
          </IconButton>
        </div>
      </div>

      {/* Search Section */}
      <div className="p-4 bg-gray-800 rounded-lg shadow-sm text-white">
        <TextField
          placeholder="Search..."
          variant="outlined"
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="text-white" />
              </InputAdornment>
            ),
            className: "bg-gray-700 text-white rounded-full", // Rounded input for search
          }}
        />
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto bg-gray-900 p-4 rounded-lg shadow-sm"> {/* Dark background for messages */}
        <ConversationsItem />
        {/* Add more ConversationsItem components here */}
      </div>
    </div>
  );
};

export default SideBar;
