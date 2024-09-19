import React, { useState, useEffect } from "react";
import SideBar from "./sideBar";
import WorkArea from "./workArea";
import { motion } from 'framer-motion';

const images = [
  'https://media.istockphoto.com/id/480336296/photo/tracked-excavators.jpg?s=2048x2048&w=is&k=20&c=UKB4a0hylVCaKL_Qz29J8xZVuUVkF8b4u3n_w1OQOQs=',
  'https://plus.unsplash.com/premium_photo-1661951710685-a676c4190c19?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1622645636770-11fbf0611463?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

const MainContent = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // Function to cycle through the images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <motion.div 
      className="relative flex items-center justify-center h-screen"
      style={{
        backgroundImage: `url(${images[currentImage]})`, // Dynamic background outside the container
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 2s ease-in ease-out',
      }}
    >
      {/* Semi-transparent overlay for contrast */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 z-0"></div>

      {/* Main Content Container */}
      <motion.div 
        className="relative flex flex-col items-center justify-center container mx-auto bg-white text-gray-800 shadow-2xl h-[calc(100vh-2rem)] max-w-7xl w-full rounded-xl overflow-hidden m-4 z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Main Flex Container */}
        <motion.div 
          className="flex w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Sidebar Section with First Image */}
          <motion.div 
            className="w-1/3 bg-cover bg-center bg-no-repeat p-6 flex flex-col space-y-6 text-white h-full"
            style={{
              backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1663951812955-b71be2657fd1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'
            }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <SideBar />
          </motion.div>

          {/* Work Area Section with Second Image */}
          <motion.div 
            className="w-2/3 bg-cover bg-center bg-no-repeat p-6 flex flex-col space-y-6 text-white h-full"
            style={{
              backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1666611836463-edff99e87716?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)'
            }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <WorkArea />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MainContent;
