import React, { useEffect, useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import { motion } from 'framer-motion';
import axios from 'axios';  // Axios for making API calls

const ConversationsItem = ({ darkMode, onSelectUser, onSelectGroup }) => {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  // Polling interval in milliseconds (e.g., 5000ms = 5 seconds)
  const POLLING_INTERVAL = 2000;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch users
        const usersResponse = await axios.get(`http://localhost:3000/userFriends`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUsers(usersResponse.data);

        // Fetch groups
        const groupsResponse = await axios.get(`http://localhost:3000/userGroups`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setGroups(groupsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Initial fetch
    fetchData();

    // Set up the polling interval
    const intervalId = setInterval(fetchData, POLLING_INTERVAL);

    // Cleanup: clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);  // Run once when the component mounts

  return (
    <div>
      {/* Render users */}
      {users.length > 0 && (
        <div>
          <h2 className={`text-lg text-white`}>Users</h2>
          {users.map(user => (
            <motion.div 
              key={user._id}
              className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-300 ease-in-out shadow-md mb-2 
              ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'}`}
              onClick={() => onSelectUser(user)}
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
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last message snippet...</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Render groups */}
      {groups.length > 0 && (
        <div className="mt-6">
          <h2 className={`text-lg text-white`}>Groups</h2>
          {groups.map(group => (
            <motion.div 
              key={group._id}
              className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-300 ease-in-out shadow-md mb-2 
              ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'}`}
              onClick={() => onSelectGroup(group)}
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
                <p className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>{group.name}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Group chat...</p>
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
