import React from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ConversationsItem = () => {
    return (
        <div className="flex items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-all duration-300 ease-in-out shadow-md text-white"> {/* Added padding, hover, and transition effects */}
            <div className="flex-shrink-0">
                <AccountCircleIcon className="text-yellow-500 text-3xl"/> {/* Enlarged icon */}
            </div>
            <div className="ml-4 flex flex-col justify-center">
                <p className="text-base font-semibold text-white">John Doe</p> {/* Increased font size and made it bold */}
                <p className="text-xs text-gray-400">Last message snippet...</p> {/* Subtle gray for the last message */}
            </div>
        </div>
    );
};

export default ConversationsItem;
