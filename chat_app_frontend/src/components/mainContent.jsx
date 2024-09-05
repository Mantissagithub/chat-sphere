import React from "react";
import SideBar from "./sideBar";
import WorkArea from "./workArea";

const MainContent = () => {
  return (
    <div className="flex flex-col items-center justify-center container mx-auto bg-white text-gray-800 shadow-2xl m-4 h-[calc(100vh-2rem)] max-w-7xl w-full rounded-lg"> {/* Rounded container */}
      <div className="flex w-full h-full">
        <div className="w-1/3 bg-gradient-to-b from-[#FFC400] to-[#2679B8] p-6 flex items-center justify-center relative text-white"> {/* Caterpillar Yellow to Blue */}
          <SideBar />
        </div>
        <div className="w-[1px] bg-gray-300 h-full"></div> {/* Thin dividing line */}
        <div className="w-2/3 bg-black p-6 flex items-center justify-center relative text-white"> {/* Black background for work area */}
          <WorkArea />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
