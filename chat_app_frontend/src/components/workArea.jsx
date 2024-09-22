import React, { useState, useEffect } from "react";
import { TextField, IconButton } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { motion } from 'framer-motion';
import axios from 'axios';

const WorkArea = ({ selectedUser, selectedGroup }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  // Fetch messages when a user/group is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser || selectedGroup) {
        try {
          const url = selectedGroup
            ? `http://localhost:3000/groups/${selectedGroup.id}/messages`
            : `http://localhost:3000/messages/${selectedUser._id}`;

          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages", error);
        }
      }
    };

    fetchMessages();
  }, [selectedUser, selectedGroup]);

  // Send message
  const sendMessage = async () => {
    try {
      const url = selectedGroup
        ? `http://localhost:3000/groups/${selectedGroup.id}/messages`
        : `http://localhost:3000/messages`;

      const payload = selectedGroup
        ? { content: messageText }
        : { receiver: selectedUser, content: messageText };

      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Add the new message to the conversation
      setMessages((prevMessages) => [...prevMessages, response.data]);

      // Clear input
      setMessageText('');
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <motion.div className="flex flex-col w-full h-full bg-transparent from-gray-800 to-gray-600 p-6 space-y-4 text-white">
      {/* Chat Header */}
      <motion.div className="chatHeader flex items-center justify-between p-4 bg-gray-700 shadow-md rounded-lg border-b border-gray-600">
        <IconButton className="text-yellow-500">
          <AccountCircleIcon fontSize="large" />
        </IconButton>
        <motion.h2 className="text-2xl font-bold tracking-wide">
          {selectedGroup 
            ? (selectedGroup?.name || 'Select a conversation') 
            : (selectedUser?.fullName || 'Select a conversation')}
        </motion.h2>
        <IconButton className="text-gray-400 hover:text-red-500 transition-colors">
          <DeleteOutlineIcon />
        </IconButton>
      </motion.div>

      {/* Message Container */}
      <motion.div className="messageContainer flex-1 bg-gray-700 overflow-y-auto p-6 rounded-lg shadow-inner space-y-4">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <motion.div key={index} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'} w-full`}>
              <div className={`messageBubble max-w-xs p-4 rounded-2xl shadow-md ${msg.fromMe ? 'bg-yellow-500 text-black' : 'bg-gray-200 text-gray-900'} space-y-1`}>
                <p className="font-bold text-sm">{msg.sender.username}</p>
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div className="flex justify-center items-center w-full h-full">
            <p>No conversation selected</p>
          </motion.div>
        )}
      </motion.div>

      {/* Chat Input Area */}
      <motion.div className="chatInputArea flex items-center bg-gray-800 shadow-lg p-3 rounded-lg border-t border-gray-600">
        <TextField
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          variant="outlined"
          fullWidth
          size="small"
          className="mr-3"
          InputProps={{
            className: "bg-white text-black rounded-full px-4 py-2",
          }}
        />
        <IconButton className="bg-yellow-500 text-white hover:bg-yellow-600 transition-all rounded-full p-3 shadow-md" onClick={sendMessage}>
          <SendIcon fontSize="medium" />
        </IconButton>
      </motion.div>
    </motion.div>
  );
};

export default WorkArea;
