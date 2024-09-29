import React, { useState } from 'react';
import VideoCall from './videoCall';
import JoinCall from './joinCall';

const CallApp = ({ isInitiator }) => {
    const [isInCall, setIsInCall] = useState(false);
    const [remotePeerId, setRemotePeerId] = useState('');

    const handleJoin = (peerId) => {
        console.log(`Joining call with Peer ID: ${peerId}`);
        setRemotePeerId(peerId);
        setIsInCall(true);
    };

    const handleStart = () => {
        console.log("Starting a new call...");
        setIsInCall(true);  // No need for Peer ID in this case
    };

    return (
        <div>
            {!isInCall ? (
                <>
                    <h1>{isInitiator ? "Start a Video Call" : "Join a Video Call"}</h1>
                    {!isInitiator ? (
                        <JoinCall onJoin={handleJoin} />
                    ) : (
                        <button onClick={handleStart}>Start Call</button>
                    )}
                </>
            ) : (
                <VideoCall remotePeerId={remotePeerId} />
            )}
        </div>
    );
};

export default CallApp;
