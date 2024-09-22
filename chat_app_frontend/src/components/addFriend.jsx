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
    const [success, setSuccess] = useState(false); // New state to manage success

    // Debounced function to fetch user suggestions
    const fetchSuggestions = _.debounce(async (query) => {
        console.log('Fetching suggestions for:', query); // Log the query
        try {
            const token = localStorage.getItem('token');
            const resp = await axios.get(`http://localhost:3000/users?query=${query}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('Response from /users:', resp.data); // Log response data
            setSuggestions(resp.data);
            console.log('Updated suggestions:', resp.data); // Check updated suggestions
        } catch (err) {
            console.error('Error fetching suggestions:', err);
        }
    }, 300);

    // Handle input change
    const handleUserNameChange = (e) => {
        const value = e.target.value;
        setUserName(value);
        setSuccess(false); // Reset success state when typing

        if (value) {
            fetchSuggestions(value); 
        } else {
            setSuggestions([]);
        }
    };

    // Handle suggestion click
    const handleSuggestionClick = (name) => {
        setUserName(name);  // Set clicked suggestion in the search box
        setSuccess(true);   // Set success state to true
        // Do not clear suggestions immediately; they will be cleared on adding friend or if another input is entered
    };

    // Add friend functionality
    const addFriend = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Current userName:', userName); // Log current username
            console.log('Suggestions array:', suggestions); // Log suggestions before searching

            // Find the selected user based on input
            const selectedUser = suggestions.find(user => 
                user.fullName.trim().toLowerCase() === userName.trim().toLowerCase()
            );

            console.log('Selected user:', selectedUser); // Debug log for selected user
            
            if (!selectedUser) {
                console.log('Selected user not found in suggestions:', suggestions); // Debug log
                return alert('User not found');
            }

            // Send request to add friend
            const response = await axios.post('http://localhost:3000/search/user', 
                { userId: selectedUser._id },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.status === 200) {
                gsap.to(".friend-added-message", { y: -30, opacity: 1, duration: 1 });
                alert(`Added ${userName} as a friend!`);
                setUserName('');
                setSuggestions([]);
                onClose();  // Close the modal
            } else {
                alert('Failed to add friend');
            }
        } catch (error) {
            console.error('Error adding friend:', error);
            alert('Error occurred while adding friend. Please try again.');
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
            {suggestions.length > 0 && !success && ( // Show suggestions only if not in success state
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