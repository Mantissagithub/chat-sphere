import React from "react";
import { TextField, IconButton } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const WorkArea = () => {
  const messages = [
    { user: 'John Doe', text: 'Hey there!', time: '12:00 PM', fromMe: false },
    { user: 'You', text: 'Hello!', time: '12:01 PM', fromMe: true },
    { user: 'John Doe', text: 'How are you doing?', time: '12:02 PM', fromMe: false },
    { user: 'You', text: 'I\'m good, thanks!', time: '12:03 PM', fromMe: true },
  ];

  return (
    <div className="flex flex-col w-full h-full bg-gradient-to-br from-gray-800 to-gray-600 p-6 space-y-4 text-white"> {/* Dark gradient and white text */}
      
      {/* Chat Header */}
      <div className="chatHeader flex items-center justify-between p-4 bg-gray-700 shadow-md rounded-lg border-b border-gray-600">
        <IconButton className="text-yellow-500">
            <AccountCircleIcon fontSize="large" />
        </IconButton>
        <h2 className="text-2xl font-bold tracking-wide">John Doe</h2> {/* Larger and bold text */}
        <IconButton className="text-gray-500 hover:text-red-500 transition-colors">
          <DeleteOutlineIcon />
        </IconButton>
      </div>

      {/* Message Container */}
      <div className="messageContainer flex-1 bg-gray-700 overflow-y-auto p-6 rounded-lg shadow-inner space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'} w-full`}>
            <div className={`messageBubble max-w-xs p-4 rounded-lg shadow-md ${msg.fromMe ? 'bg-yellow-500 text-black' : 'bg-gray-100 text-gray-800'} space-y-1`}>
              <p className="font-bold text-sm">{msg.user}</p>
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs text-gray-400">{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input Area */}
      <div className="chatInputArea flex items-center bg-gray-700 shadow-lg p-3 rounded-lg border-t border-gray-600">
        <TextField
          placeholder="Type a message..."
          variant="outlined"
          fullWidth
          size="small"
          className="mr-3"
          InputProps={{
            className: "bg-gray-800 text-white rounded-full px-4 py-2", // Rounded input for chat
          }}
        />
        <IconButton className="bg-yellow-500 text-black hover:bg-yellow-600 transition-all rounded-full p-3 shadow-md">
          <SendIcon fontSize="medium" />
        </IconButton>
      </div>
    </div>
  );
};

export default WorkArea;
