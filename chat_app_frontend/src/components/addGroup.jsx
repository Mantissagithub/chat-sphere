import React, { useState } from 'react';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { IconButton, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import _ from 'lodash';
import { gsap } from 'gsap';

const AddGroup = ({ onClose }) => {
    const [groupName, setGroupName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [success, setSuccess] = useState(false); // New state to manage success

    // Debounced function to fetch group suggestions
    const fetchSuggestions = _.debounce(async (query) => {
        try {
            const token = localStorage.getItem('token');
            const resp = await axios.get(`http://localhost:3000/groups?query=${query}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setSuggestions(resp.data); 
        } catch (err) {
            console.error('Error fetching groups:', err);
        }
    }, 300);

    // Handle input change
    const handleGroupNameChange = (e) => {
        const value = e.target.value;
        setGroupName(value);
        setSuccess(false); // Reset success state when typing

        if (value) {
            fetchSuggestions(value); 
        } else {
            setSuggestions([]);  
        }
    };

    // Handle suggestion click
    const handleSuggestionClick = (name) => {
        setGroupName(name);  // Set clicked suggestion in the search box
        setSuccess(true);    // Set success state to true
        // Do not clear suggestions immediately; they will be cleared on adding group or if another input is entered
    };

    // Add to group functionality
    const addToGroup = async () => {
        try {
            const token = localStorage.getItem('token');
            const selectedGroup = suggestions.find(group => group.name.trim().toLowerCase() === groupName.trim().toLowerCase());  
            
            if (!selectedGroup) return alert('Group not found');  // Alert if no group found

            await axios.post('http://localhost:3000/search/group', 
                { groupName: selectedGroup.name }, 
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            gsap.to(".group-added-message", { y: -30, opacity: 1, duration: 1 });
            alert(`Added to group: ${groupName}`);
            setGroupName('');
            setSuggestions([]);
            onClose();  
        } catch (error) {
            console.error('Error adding to group:', error);
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
                Add to Group
            </motion.div>

            <motion.div 
                initial={{ x: -100, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ duration: 0.4 }}
            >
                <TextField
                    variant="outlined"
                    placeholder="Search for a group..."
                    fullWidth
                    size="small"
                    value={groupName}
                    onChange={handleGroupNameChange}
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
                    {suggestions.map((group) => (
                        <motion.li
                            key={group._id}
                            onClick={() => handleSuggestionClick(group.name)}  
                            className="p-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {group.name}
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
                        onClick={addToGroup}  
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-md p-3"
                        size="large"
                    >
                        <DoneOutlineIcon />
                    </IconButton>
                </motion.div>
            </motion.div>
            
            <div className="group-added-message absolute -bottom-10 left-0 right-0 text-center text-green-500 font-bold opacity-0">
                Group added successfully!
            </div>
        </motion.div>
    );
};

export default AddGroup;