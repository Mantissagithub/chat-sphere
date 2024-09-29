import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { motion } from 'framer-motion';

const VideoCall = ({ selectedUser, remotePeerId }) => {
    const [peerId, setPeerId] = useState('');
    const [isCalling, setIsCalling] = useState(false);  // Loading state
    const [callError, setCallError] = useState(null);   // Error state
    const myVideoRef = useRef();
    const userVideoRef = useRef();
    const peerInstance = useRef();

    useEffect(() => {
        // Initialize PeerJS connection
        peerInstance.current = new Peer(undefined, {
            path: '/webrtc',
            host: 'localhost',
            port: '3000'
        });

        // On successful connection
        peerInstance.current.on('open', id => {
            setPeerId(id);
            console.log('My peer ID is:', id);
        });

        // Handle peer errors
        peerInstance.current.on('error', err => {
            console.error('Peer error:', err);
            setCallError('Connection error. Please try again.');
        });

        // Handle incoming calls
        peerInstance.current.on('call', call => {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    call.answer(stream);  // Answer the call with local video/audio
                    myVideoRef.current.srcObject = stream;  // Show local video
                    myVideoRef.current.play();

                    call.on('stream', remoteStream => {
                        userVideoRef.current.srcObject = remoteStream;  // Show remote video
                        userVideoRef.current.play();
                    });
                })
                .catch(err => {
                    console.error('Failed to get media:', err);
                    setCallError('Unable to access media devices.');
                });
        });

        return () => {
            peerInstance.current.destroy();  // Cleanup peer connection on unmount
        };
    }, []);

    // Function to initiate a call
    const callUser = () => {
        setCallError(null);  // Reset error state
        setIsCalling(true);  // Show loading

        if (!remotePeerId) {
            setCallError('No remote peer ID provided.');
            setIsCalling(false);  // Stop loading
            return;
        }

        // Request media devices (video and audio)
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                myVideoRef.current.srcObject = stream;  // Display local video
                myVideoRef.current.play();

                // Initiate a call with the remote peer
                const call = peerInstance.current.call(remotePeerId, stream);

                // Handle remote stream once the call is established
                call.on('stream', remoteStream => {
                    setIsCalling(false);  // Stop loading
                    userVideoRef.current.srcObject = remoteStream;  // Show remote video
                    userVideoRef.current.play();
                });

                // Handle call errors
                call.on('error', (err) => {
                    console.error('Call error:', err);
                    setCallError('Failed to establish the call.');
                    setIsCalling(false);  // Stop loading
                });
            })
            .catch(err => {
                console.error('Failed to get media:', err);
                setCallError('Failed to access camera/microphone.');
                setIsCalling(false);  // Stop loading
            });
    };

    return (
        <motion.div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col w-full max-w-md relative">
            {/* Start Call Button */}
            <Tooltip title="Start Video Call" arrow>
                <IconButton onClick={callUser} disabled={isCalling}>
                    {isCalling ? <CircularProgress size={24} /> : <VideoCallIcon />}
                </IconButton>
            </Tooltip>

            {/* Display error if any */}
            {callError && <p style={{ color: 'red' }}>{callError}</p>}

            {/* Local Video */}
            <video ref={myVideoRef} style={{ width: '100%', marginBottom: '10px' }} autoPlay playsInline />

            {/* Remote Video */}
            <video ref={userVideoRef} style={{ width: '100%' }} autoPlay playsInline />
        </motion.div>
    );
};

export default VideoCall;
