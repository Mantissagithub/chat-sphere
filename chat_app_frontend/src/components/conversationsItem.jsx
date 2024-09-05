import React from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ConversationsItem = () => {
    return (
        <div className="flex items-center p-3 rounded-lg hover:bg-gray-700 cursor-pointer text-white"> {/* Dark background and white text */}
            <div className="flex-shrink-0">
                <AccountCircleIcon className="text-yellow-500"/> {/* Yellow icon */}
            </div>
            <div className="ml-3">
                <p className="text-sm font-semibold">John Doe</p>
                <p className="text-xs text-gray-400">Last message snippet...</p>
            </div>
        </div>
    );
};

export default ConversationsItem;
