import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import VideoCallIcon from '@mui/icons-material/VideoCall';

const VideoCall = ({ remotePeerId }) => {
    const [peerId, setPeerId] = useState('');
    const [isCalling, setIsCalling] = useState(false);
    const myVideoRef = useRef();
    const userVideoRef = useRef();
    const peerInstance = useRef();

    useEffect(() => {
        // Initialize PeerJS
        peerInstance.current = new Peer();

        // On successful connection
        peerInstance.current.on('open', id => {
            console.log('My peer ID is:', id);
            setPeerId(id);
            localStorage.setItem('peerId', id); // Store in local storage
        });

        // Handle incoming calls
        peerInstance.current.on('call', call => {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    call.answer(stream);
                    myVideoRef.current.srcObject = stream; // Show local video
                    call.on('stream', remoteStream => {
                        userVideoRef.current.srcObject = remoteStream; // Show remote video
                    });
                });
        });

        return () => {
            peerInstance.current.destroy();
        };
    }, []);

    const startCall = () => {
        setIsCalling(true);
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                myVideoRef.current.srcObject = stream;
                const call = peerInstance.current.call(remotePeerId, stream);
                call.on('stream', remoteStream => {
                    userVideoRef.current.srcObject = remoteStream;
                });
            })
            .catch(err => {
                console.error('Failed to get media stream', err);
                setIsCalling(false);
            });
    };

    return (
        <div>
            <h3>Your Peer ID: {peerId}</h3>
            <Tooltip title="Start Video Call" arrow>
                <IconButton onClick={startCall} disabled={isCalling}>
                    {isCalling ? <CircularProgress size={24} /> : <VideoCallIcon />}
                </IconButton>
            </Tooltip>
            <video ref={myVideoRef} autoPlay playsInline muted />
            <video ref={userVideoRef} autoPlay playsInline />
        </div>
    );
};

export default VideoCall;
