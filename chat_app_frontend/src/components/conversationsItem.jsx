import React, { useEffect, useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import { motion } from 'framer-motion';
import axios from 'axios';  // Axios for making API calls

const ConversationsItem = ({ darkMode, onSelectUser, onSelectGroup }) => {  // Accept darkMode and selection handlers as props
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  // Fetch users and groups when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch users
        const resp = await axios.get(`http://localhost:3000/users?`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUsers(resp.data);

        // Fetch groups
        const resp1 = await axios.get(`http://localhost:3000/userGroups`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setGroups(resp1.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);  // Run on component mount

  return (
    <div>
      {/* Render users */}
      {users.length > 0 && (
        <div>
          <h2 className={`text-lg ${darkMode ? 'text-white' : 'text-black'}`}>Users</h2>
          {users.map(user => (
            <motion.div 
              key={user._id}  // Use user's _id as a unique key
              className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-300 ease-in-out shadow-md mb-2 
              ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'}`}
              onClick={() => onSelectUser(user)} // Call handler on click
              whileHover={{ scale: 1.05, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="flex-shrink-0">
                <AccountCircleIcon className={`${darkMode ? 'text-yellow-500' : 'text-yellow-600'} text-3xl`} />
              </div>
              <div className="ml-4 flex flex-col justify-center">
                <p className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>{user.fullName}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last message snippet...</p> {/* Replace with actual message data */}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Render groups */}
      {groups.length > 0 && (
        <div className="mt-6">
          <h2 className={`text-lg ${darkMode ? 'text-white' : 'text-black'}`}>Groups</h2>
          {groups.map(group => (
            <motion.div 
              key={group._id}  // Use group's _id as a unique key
              className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-300 ease-in-out shadow-md mb-2 
              ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'}`}
              onClick={() => onSelectGroup(group)} // Call handler on click
              whileHover={{ scale: 1.05, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="flex-shrink-0">
                <GroupIcon className={`${darkMode ? 'text-blue-500' : 'text-blue-600'} text-3xl`} />
              </div>
              <div className="ml-4 flex flex-col justify-center">
                <p className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>{group.name}</p> {/* Assuming group has a name property */}
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Group chat...</p> {/* Replace with actual group info */}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Handle empty states */}
      {users.length === 0 && groups.length === 0 && (
        <p className={`${darkMode ? 'text-white' : 'text-black'}`}>No conversations available.</p>
      )}
    </div>
  );
};

export default ConversationsItem;