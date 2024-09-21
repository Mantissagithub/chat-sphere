import React, { useState } from 'react';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { IconButton, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import _ from 'lodash';
import { gsap } from 'gsap';

const AddFriend = ({ onClose }) => {
    const [userName, setUserName] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const fetchSuggestions = _.debounce(async (query) => {
        try {
            const token = localStorage.getItem('token');
            const resp = await axios.get(`http://localhost:3000/users?query=${query}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setSuggestions(resp.data);
        } catch (err) {
            console.error(err);
        }
    }, 300);

    const handleUserNameChange = (e) => {
        const value = e.target.value;
        setUserName(value);

        if (value) {
            fetchSuggestions(value);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (name) => {
        setUserName(name);  // Set clicked suggestion in the search box
        setSuggestions([]);  // Clear suggestions
    };

    const addFriend = async () => {
        try {
            const token = localStorage.getItem('token');
            const selectedUser = suggestions.find(user => user.fullName === userName);  // Find the selected user
            if (!selectedUser) return;  // If no user is selected, don't proceed

            await axios.post('http://localhost:3000/search/user', { userId: selectedUser._id }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            gsap.to(".friend-added-message", { y: -30, opacity: 1, duration: 1 });
            alert(`Added ${userName} as a friend!`);
            setUserName('');
            setSuggestions([]);
            onClose();  // Close the modal
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col w-full max-w-sm relative"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
            <motion.div
                className="text-center font-bold text-xl mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
            >
                Add a New Friend
            </motion.div>

            <motion.div 
                initial={{ x: -100, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ duration: 0.4 }}
            >
                <TextField
                    variant="outlined"
                    placeholder="Search for a user..."
                    fullWidth
                    size="small"
                    value={userName}
                    onChange={handleUserNameChange}
                    className="bg-gray-100 dark:bg-gray-700 rounded-lg px-2 py-1 transition-all focus:ring-2 focus:ring-blue-500"
                    InputProps={{
                        className: 'text-gray-800 dark:text-white',
                    }}
                />
            </motion.div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
                <motion.ul
                    className="absolute z-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-2 w-full max-h-48 overflow-y-auto transition-all"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                >
                    {suggestions.map((user) => (
                        <motion.li
                            key={user._id}
                            onClick={() => handleSuggestionClick(user.fullName)}  // Set suggestion to input on click
                            className="p-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {user.fullName}
                        </motion.li>
                    ))}
                </motion.ul>
            )}

            {/* Submit Button */}
            <motion.div
                className="flex justify-center mt-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95, rotate: -5 }}
                >
                    <IconButton
                        color="primary"
                        onClick={addFriend}  // Add friend using current input
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-md p-3"
                        size="large"
                    >
                        <DoneOutlineIcon />
                    </IconButton>
                </motion.div>
            </motion.div>
            
            <div className="friend-added-message absolute -bottom-10 left-0 right-0 text-center text-green-500 font-bold opacity-0">
                Friend added successfully!
            </div>
        </motion.div>
    );
};

export default AddFriend;
