import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('About Us');
  const [isOpen, setIsOpen] = useState(false);

  // Navigation items and animation variants from Home page
  const navItems = ['Home', 'Features', 'About Us', 'Contact'];
  
  const navItem = {
    hidden: { y: -20, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100
      }
    }),
    hover: {
      scale: 1.1,
      textShadow: "0 0 8px rgba(255,255,255,0.8)",
      transition: { type: "spring", stiffness: 300 }
    },
    tap: { scale: 0.95 }
  };

  const buttonSpring = {
    hover: { 
      scale: 1.05,
      boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
    },
    tap: { 
      scale: 0.95,
      boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const teamMembers = [
    {
      name: "Dr. John Smith",
      role: "Medical Director",
      image: "https://ui-avatars.com/api/?name=John+Smith&background=0D8ABC&color=fff",
    },
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Technology Officer",
      image: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=FF6B6B&color=fff",
    },
    {
      name: "Michael Brown",
      role: "System Administrator",
      image: "https://ui-avatars.com/api/?name=Michael+Brown&background=56C596&color=fff",
    }
  ];

  const handleNavigation = (item) => {
    setActiveNav(item);
    if (item === 'Home') {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation Bar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <Link to="/">
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-400"
                >
                  HealthCare HIMS
                </motion.span>
              </Link>
            </motion.div>
            
            <nav className="hidden md:flex space-x-2">
              {navItems.map((item, i) => (
                <motion.div
                  key={item}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                  variants={navItem}
                  onClick={() => handleNavigation(item)}
                  className={`px-4 py-2 rounded-full cursor-pointer ${activeNav === item ? 
                    'bg-white text-purple-600 font-bold' : 
                    'text-white hover:bg-white/20'}`}
                >
                  {item}
                </motion.div>
              ))}
            </nav>
            
            <div className="hidden md:flex space-x-4">
              <Link to="/admin">
                <motion.button
                  variants={buttonSpring}
                  whileHover="hover"
                  whileTap="tap"
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-bold shadow-lg"
                >
                  Sign In
                </motion.button>
              </Link>
              
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="px-6 py-2 rounded-full bg-white text-purple-600 font-bold shadow-lg"
                >
                  Register
                </button>

                {isOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-lg">
                    <Link
                      to="/patient/register"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      AS USER
                    </Link>
                    <Link
                      to="/hospital-register"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      AS HOSPITAL
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            <motion.button 
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden text-xl text-white"
            >
              ☰
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        className="pt-32 pb-16 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
            {...fadeIn}
          >
            About HealthCare HIMS
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            {...fadeIn}
          >
            Revolutionizing healthcare management through innovative technology solutions.
          </motion.p>
        </div>
      </motion.section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto grid md:grid-cols-2 gap-12">
          <motion.div 
            className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Our Mission</h2>
            <p className="text-gray-700">
              To provide cutting-edge healthcare information management solutions that enhance patient care, 
              streamline hospital operations, and improve healthcare outcomes across Sri Lanka.
            </p>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Our Vision</h2>
            <p className="text-gray-700">
              To become the leading healthcare information management system in Sri Lanka, 
              setting new standards for digital healthcare solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-center text-gray-800 mb-12"
            {...fadeIn}
          >
            Our Team
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                  <p className="text-blue-600">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-indigo-100">
        <div className="container mx-auto text-center">
          <motion.h2 
            className="text-3xl font-bold text-gray-800 mb-8"
            {...fadeIn}
          >
            Get in Touch
          </motion.h2>
          <motion.div 
            className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-gray-600 mb-4">Email: contact@healthcarehims.com</p>
            <p className="text-gray-600 mb-4">Phone: +94 11 2345 6789</p>
            <p className="text-gray-600">Address: 123 Healthcare Avenue, Colombo, Sri Lanka</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
