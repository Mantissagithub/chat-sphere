import React, { useState, useEffect, useRef } from "react";
import { TextField, IconButton, Modal, Box } from "@mui/material"; // Added Modal and Box imports
import SendIcon from "@mui/icons-material/Send";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import VideoCallIcon from '@mui/icons-material/VideoCall';
import { motion } from "framer-motion";
import axios from "axios";
import io from "socket.io-client";
import CallApp from "./callApp";
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import ReceiverModal from "./receiverUserFilePopup"; // Import the ReceiverModal component

const socket = io("http://localhost:3000");

const formatTimestamp = (timestamp) => {
  const messageDate = new Date(timestamp);
  const now = new Date();

  const isToday = messageDate.toDateString() === now.toDateString();
  const isYesterday =
    messageDate.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString();

  const time = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isToday) {
    return `Today at ${time}`;
  } else if (isYesterday) {
    return `Yesterday at ${time}`;
  } else {
    const options = { weekday: 'long' };
    const day = messageDate.toLocaleDateString(undefined, options);
    return `${day} at ${time}`;
  }
};

const WorkArea = ({ selectedUser, selectedGroup, darkMode }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [userColors, setUserColors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  // const [remotePeerId, setRemotePeerId] = useState('');
  const [isInitiator, setIsInitiator] = useState(false);
  const messageContainerRef = useRef(null);

  // Function to toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // const toggleVideoModal = () => {
  //   setIsVideoModalOpen(!isVideoModalOpen);
  // }

  const openVideoModal = (isStartingCall) => {
    setIsInitiator(isStartingCall);
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };

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

  // useEffect(() => {
  //   if (selectedUser) {
  //       socket.emit("getPeerId", selectedUser._id);

  //       const handleReceivePeerId = (peerId) => {
  //           console.log('Received Peer ID:', peerId);
  //           setRemotePeerId(peerId); 
  //       };

  //       socket.on("receivePeerId", handleReceivePeerId);

  //       return () => {
  //           socket.off("receivePeerId", handleReceivePeerId);
  //       };
  //   }
  // }, [selectedUser]);


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

  const handleDeleteMessages = async () => {
    try {
      const userId = selectedUser?._id; // Added null check for selectedUser

      await axios.delete("http://localhost:3000/messages/delete", {
        data: { userId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Clear the messages in the UI after deletion
      setMessages([]);
    } catch (error) {
      console.error("Error deleting messages:", error);
    }
  };

  const handleDeleteMessageGroup = async () => {
    try {
      const groupId = selectedGroup?.id; // Added null check for selectedGroup

      await axios.delete("http://localhost:3000/groupmessages/delete", {
        data: { groupId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Clear the messages in the UI after deletion
      setMessages([]);
    } catch (error) {
      console.error("Error deleting messages:", error);
    }
  };

  const handleDelete = () => {
    if (selectedGroup) {
      handleDeleteMessageGroup();
    } else if (selectedUser) {
      handleDeleteMessages();
    }
  };

  // Send message
  const sendMessage = async () => {
    try {
      const url = selectedGroup
        ? `http://localhost:3000/groups/messages`
        : `http://localhost:3000/messages`;

      const payload = selectedGroup
        ? { groupId: selectedGroup.id, content: messageText, timeStamp: new Date() }
        : { receiver: selectedUser?._id, content: messageText, timeStamp: new Date() }; // Added null check for selectedUser

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
        <IconButton className="text-yellow-500" onClick={toggleModal}>
          <AccountCircleIcon fontSize="large" />
        </IconButton>
        <motion.h2 className="text-2xl font-bold tracking-wide">
          {selectedGroup
            ? selectedGroup?.name || "Select a conversation"
            : selectedUser?.fullName || "Select a conversation"}
        </motion.h2>
        <IconButton className="text-gray-400 hover:text-green-500 transition-colors" onClick={() => openVideoModal(true)}>
          <CallMadeIcon /> {/* Start Video Call Icon */}
        </IconButton>
        <IconButton className="text-gray-400 hover:text-blue-500 transition-colors" onClick={() => openVideoModal(false)}>
          <CallReceivedIcon/>
        </IconButton>
        <IconButton className="text-gray-400 hover:text-red-500 transition-colors" onClick={handleDelete}>
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
              : ""; // Other users: Will use inline style for dynamic color

            return (
              <motion.div
                key={index}
                className={`flex ${isFromCurrentUser ? "justify-end" : "justify-start"} w-full`}
              >
                <div
                  className={`messageBubble max-w-xs p-4 rounded-2xl shadow-md text-white`}
                  style={{ backgroundColor: userColors[msg.sender] || "#ccc" }} // Dynamic inline color
                >
                  {/* Always display sender's name */}
                  <p className="text-xs font-semibold">{msg.senderName}</p>
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs text-gray-500">
                    {formatTimestamp(msg.timeStamp)}
                  </p>
                </div>
              </motion.div>
            );
          })
        ) : (
          <motion.p className="text-gray-400 text-center">
            Start a conversation!
          </motion.p>
        )}
      </motion.div>

      {/* Message Input */}
      <motion.div className="messageInput flex items-center p-4 space-x-4 bg-gray-700 rounded-lg shadow-md">
        <TextField
          className="flex-1 bg-gray-800 text-white rounded-lg shadow-inner"
          placeholder="Type your message"
          variant="outlined"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()} // Send on Enter
          InputProps={{
            style: {
              color: "white", // Text color
            },
          }}
        />
        <IconButton
          className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-full"
          onClick={sendMessage}
        >
          <SendIcon />
        </IconButton>
      </motion.div>

      {/* Receiver Modal */}
      {selectedUser && isModalOpen && (
        <Modal
          open={true}
          onClose={toggleModal}
          aria-labelledby="receiver-modal"
          aria-describedby="modal-to-view-receiver-details"
          closeAfterTransition
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: darkMode ? "grey.900" : "white",
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
              <ReceiverModal userId={selectedUser._id} darkMode={darkMode} />
            </motion.div>
          </Box>
        </Modal>
      )}

      {/* {isVideoModalOpen && (
        <Modal
          open={true}
          onClose={toggleVideoModal}
          aria-labelledby="video-call-modal"
          aria-describedby="modal-for-video-call"
          closeAfterTransition
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: darkMode ? "grey.900" : "white",
              boxShadow: 24,
              p: 4,
              width: 600,
              height: 400,
              borderRadius: 2,
            }}
          >
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <VideoCall selectedUser={selectedUser} remotePeerId={remotePeerId}/>
            </motion.div>
          </Box>
        </Modal> */}

      {/* )} */}
      {/* Modal for showing video call option */}
      <Modal open={isVideoModalOpen} onClose={closeVideoModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#222',
          boxShadow: 24,
          p: 4,
          borderRadius: '10px',
          width: '80%',
          height: '70%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <CallApp isInitiator={isInitiator} />
        </Box>
      </Modal>
    </motion.div>
  );
};

export default WorkArea;
