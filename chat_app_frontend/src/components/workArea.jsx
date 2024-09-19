import React from "react";
import { TextField, IconButton } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { motion } from 'framer-motion';

const WorkArea = () => {
  const messages = [
    { user: 'John Doe', text: 'Hey there!', time: '12:00 PM', fromMe: false },
    { user: 'You', text: 'Hello!', time: '12:01 PM', fromMe: true },
    { user: 'John Doe', text: 'How are you doing?', time: '12:02 PM', fromMe: false },
    { user: 'You', text: 'I\'m good, thanks!', time: '12:03 PM', fromMe: true },
  ];

  return (
    <motion.div 
      className="flex flex-col w-full h-full bg-transparent from-gray-800 to-gray-600 p-6 space-y-4 text-white"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Chat Header */}
      <motion.div 
        className="chatHeader flex items-center justify-between p-4 bg-gray-700 shadow-md rounded-lg border-b border-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeInOut" }}
      >
        <IconButton className="text-yellow-500">
          <AccountCircleIcon fontSize="large" />
        </IconButton>
        <motion.h2
          className="text-2xl font-bold tracking-wide"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeInOut" }}
        >
          John Doe
        </motion.h2>
        <IconButton className="text-gray-400 hover:text-red-500 transition-colors">
          <DeleteOutlineIcon />
        </IconButton>
      </motion.div>

      {/* Message Container */}
      <motion.div 
        className="messageContainer flex-1 bg-gray-700 overflow-y-auto p-6 rounded-lg shadow-inner space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeInOut" }}
      >
        {messages.map((msg, index) => (
          <motion.div 
            key={index} 
            className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'} w-full`}
            initial={{ opacity: 0, x: msg.fromMe ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5, ease: "easeInOut" }}
          >
            <div className={`messageBubble max-w-xs p-4 rounded-2xl shadow-md ${msg.fromMe ? 'bg-yellow-500 text-black' : 'bg-gray-200 text-gray-900'} space-y-1`}>
              <p className="font-bold text-sm">{msg.user}</p>
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs text-gray-500">{msg.time}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Chat Input Area */}
      <motion.div 
        className="chatInputArea flex items-center bg-gray-800 shadow-lg p-3 rounded-lg border-t border-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5, ease: "easeInOut" }}
      >
        <TextField
          placeholder="Type a message..."
          variant="outlined"
          fullWidth
          size="small"
          className="mr-3"
          InputProps={{
            className: "bg-white text-white rounded-full px-4 py-2", 
          }}
        />
        <IconButton className="bg-yellow-500 text-white hover:bg-yellow-600 transition-all rounded-full p-3 shadow-md">
          <SendIcon fontSize="medium" />
        </IconButton>
      </motion.div>
    </motion.div>
  );
};

export default WorkArea;
