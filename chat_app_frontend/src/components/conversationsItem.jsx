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
    <div className="p-2 space-y-2">
      {/* Render users */}
      {users.length > 0 && (
        <div>
          <h2 className={`text-lg font-semibold mb-2 px-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Users</h2>
          {users.map(user => (
            <motion.div
              key={user._id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ease-in-out mb-2
                          ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'}
                          hover:shadow-md dark:hover:shadow-lg-dark`}
              onClick={() => onSelectUser(user)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="flex-shrink-0">
                <AccountCircleIcon className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} text-3xl`} />
              </div>
              <div className="ml-3 flex flex-col justify-center">
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{user.fullName}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last message snippet...</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Render groups */}
      {groups.length > 0 && (
        <div className="mt-4">
          <h2 className={`text-lg font-semibold mb-2 px-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Groups</h2>
          {groups.map(group => (
            <motion.div
              key={group._id} // Assuming group has _id, if it's group.id, change accordingly
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ease-in-out mb-2
                          ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'}
                          hover:shadow-md dark:hover:shadow-lg-dark`}
              onClick={() => onSelectGroup(group)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="flex-shrink-0">
                <GroupIcon className={`${darkMode ? 'text-green-400' : 'text-green-600'} text-3xl`} />
              </div>
              <div className="ml-3 flex flex-col justify-center">
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{group.name}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Group chat...</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Handle empty states */}
      {users.length === 0 && groups.length === 0 && (
        <p className={`text-center p-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No conversations available.</p>
      )}
    </div>
  );
};

export default ConversationsItem;
