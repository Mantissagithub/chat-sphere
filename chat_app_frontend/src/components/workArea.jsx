import React, { useState, useEffect, useRef } from "react";
import { TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { motion } from "framer-motion";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const WorkArea = ({ selectedUser, selectedGroup }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [userColors, setUserColors] = useState({});
  const messageContainerRef = useRef(null);

  // Function to generate random color
  const generateRandomColor = (prevColor) => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    do {
      color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
    } while (color === prevColor); // Ensure new color is different from the last one
    return color;
  };

  // Fetch current user profile
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user", error);
      }
    };
    fetchCurrentUser();
  }, []);

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
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setMessages(response.data);

        } catch (error) {
          console.error("Error fetching messages", error);
        }
      }
    };

    fetchMessages();

    // Join the correct room (user or group) in Socket.IO
    if (selectedUser) {
      socket.emit("join", selectedUser._id);
    } else if (selectedGroup) {
      socket.emit("joinGroup", selectedGroup.id);
    }
  }, [selectedUser, selectedGroup]);

  // Handle incoming socket messages (real-time updates)
  useEffect(() => {
    const handleIncomingMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("message", handleIncomingMessage); // Listen for direct messages
    socket.on("groupMessage", handleIncomingMessage); // Listen for group messages

    return () => {
      socket.off("message", handleIncomingMessage);
      socket.off("groupMessage", handleIncomingMessage);
    };
  }, []);

  // Scroll to the latest message when new messages are added
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Assign unique colors to users after messages are fetched
  useEffect(() => {
    if (messages.length > 0) {
      const updatedColors = { ...userColors };

      messages.forEach((msg, index) => {
        if (!updatedColors[msg.sender]) {
          const prevColor = index > 0 ? updatedColors[messages[index - 1].sender] : "";
          updatedColors[msg.sender] = generateRandomColor(prevColor);
        }
      });

      setUserColors(updatedColors);
    }
  }, [messages]); // This will run only when `messages` change

  // Send message
  const sendMessage = async () => {
    try {
      const url = selectedGroup
        ? `http://localhost:3000/groups/messages`
        : `http://localhost:3000/messages`;

      const payload = selectedGroup
        ? { groupId: selectedGroup.id, content: messageText, timeStamp: new Date() }
        : { receiver: selectedUser._id, content: messageText, timeStamp: new Date() };

      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Emit the new message via socket to other participants
      if (selectedGroup) {
        socket.emit("groupMessage", response.data);
      } else {
        socket.emit("message", response.data);
      }

      // Add the new message to the conversation
      setMessages((prevMessages) => [...prevMessages, response.data]);

      // Clear input
      setMessageText("");
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
            ? selectedGroup?.name || "Select a conversation"
            : selectedUser?.fullName || "Select a conversation"}
        </motion.h2>
        <IconButton className="text-gray-400 hover:text-red-500 transition-colors">
          <DeleteOutlineIcon />
        </IconButton>
      </motion.div>

      {/* Message Container */}
      <motion.div
        ref={messageContainerRef}
        className="messageContainer flex-1 bg-gray-700 overflow-y-auto p-6 rounded-lg shadow-inner space-y-4"
      >
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const isFromCurrentUser = msg.sender === currentUser?.id;
            const userColor = isFromCurrentUser
              ? "bg-yellow-500 text-black" // Current user: Yellow
              : `bg-[${userColors[msg.sender] || "#ccc"}] text-white`; // Other users: Random color

            return (
              <motion.div
                key={index}
                className={`flex ${isFromCurrentUser ? "justify-end" : "justify-start"} w-full`}
              >
                <div className={`messageBubble max-w-xs p-4 rounded-2xl shadow-md ${userColor} space-y-1`}>
                  {/* Always display sender's name */}
                  <p className="text-xs font-semibold">{msg.senderName}</p>
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(msg.timeStamp).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            );
          })
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
        <IconButton
          className="bg-yellow-500 text-white hover:bg-yellow-600 transition-all rounded-full p-3 shadow-md"
          onClick={sendMessage}
        >
          <SendIcon fontSize="medium" />
        </IconButton>
      </motion.div>
    </motion.div>
  );
};

export default WorkArea;
