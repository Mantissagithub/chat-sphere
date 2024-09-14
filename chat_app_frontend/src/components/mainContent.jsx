import React from "react";
import SideBar from "./sideBar";
import WorkArea from "./workArea";

const MainContent = () => {
  return (
    <div className="flex flex-col items-center justify-center container mx-auto bg-white text-gray-800 shadow-2xl h-[calc(100vh-2rem)] max-w-7xl w-full rounded-xl overflow-hidden m-4">
      
      {/* Main Flex Container */}
      <div className="flex w-full h-full">
        
        {/* Sidebar Section */}
        <div className="w-1/3 bg-gradient-to-b from-yellow-400 to-blue-600 p-6 flex flex-col space-y-6 text-white h-full">
          <SideBar />
        </div>
        
        {/* Work Area Section */}
        <div className="w-2/3 bg-gray-900 p-6 flex flex-col space-y-6 text-white h-full">
          <WorkArea />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
