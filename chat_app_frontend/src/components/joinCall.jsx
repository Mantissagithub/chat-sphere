import React, { useState } from 'react';
import { Button, TextField, Alert } from '@mui/material';

const JoinCall = ({ onJoin }) => {
    const [inputPeerId, setInputPeerId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleJoin = () => {
        const storedPeerId = localStorage.getItem('peerId');

        if (inputPeerId === storedPeerId) {
            setErrorMessage('You cannot join your own call.');
        } else if (inputPeerId) {
            onJoin(inputPeerId); // Call function to join with the entered Peer ID
        } else {
            setErrorMessage('Please enter a valid Peer ID.');
        }
    };

    return (
        <div>
            <TextField
                label="Enter Peer ID"
                variant="outlined"
                value={inputPeerId}
                onChange={(e) => setInputPeerId(e.target.value)}
                fullWidth
            />
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <Button onClick={handleJoin} variant="contained" color="primary">
                Join Call
            </Button>
        </div>
    );
};

export default JoinCall;
