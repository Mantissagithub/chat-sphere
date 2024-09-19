import React from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { motion } from 'framer-motion';

const ConversationsItem = () => {
  return (
    <motion.div 
      className="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-all duration-300 ease-in-out shadow-md text-white"
      whileHover={{ scale: 1.05, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)" }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="flex-shrink-0">
        <AccountCircleIcon className="text-yellow-500 text-3xl" /> {/* Enlarged icon */}
      </div>
      <div className="ml-4 flex flex-col justify-center">
        <p className="text-base font-semibold text-white">John Doe</p> {/* Increased font size and made it bold */}
        <p className="text-xs text-gray-400">Last message snippet...</p> {/* Subtle gray for the last message */}
      </div>
    </motion.div>
  );
};

export default ConversationsItem;
