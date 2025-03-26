import React, { useState, useRef, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import videoFile from '../components/home/bvideo.mp4';
import './styles.css';

const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeNav, setActiveNav] = useState('Home');
  const videoRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Enhanced auto-play with intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current.play().catch(e => console.log("Auto-play prevented:", e));
          }
        });
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  // Animation variants
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

  const navItems = ['Home', 'Features', 'Pricing', 'About Us', 'Contact'];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900">
      {/* Vibrant Navigation Bar */}
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
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-400"
              >
                HealthCare HIMS
              </motion.span>
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
                  onClick={() => setActiveNav(item)}
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
              {/* Register Button with Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-6 py-2 rounded-full bg-white text-purple-600 font-bold shadow-lg"
        >
          Register
        </button>

        {/* Dropdown Menu */}
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

      {/* Hero Section with Video Background */}
      <div className="relative h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src={videoFile} type="video/mp4" />
        </video>
        
        {/* Animated Gradient Overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-gradient-to-br from-purple-900/70 to-blue-900/70"
        />
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-400">
                Revolutionizing
              </span> Healthcare
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              "Transforming healthcare through secure rechords AI-driven insights and seamless
              hospital interation for smarter and more accessible patient care" .
            </motion.p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  background: "linear-gradient(45deg, #f6d365, #fda085)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-bold text-lg shadow-xl hover:shadow-2xl"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(255,255,255,0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="px-8 py-4 rounded-full border-2 border-white text-white font-bold text-lg bg-transparent hover:bg-white/10"
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring" }}
            className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
          >
            Powerful Features
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: "🏥", 
                title: "Patient Management", 
                desc: "Comprehensive records and scheduling",
                color: "bg-gradient-to-br from-purple-500 to-indigo-500"
              },
              { 
                icon: "📊", 
                title: "Analytics Dashboard", 
                desc: "Real-time data visualization",
                color: "bg-gradient-to-br from-blue-500 to-teal-500"
              },
              { 
                icon: "🔒", 
                title: "Security First", 
                desc: "HIPAA-compliant protection",
                color: "bg-gradient-to-br from-green-500 to-emerald-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                whileHover={{ y: -10 }}
                className={`${feature.color} p-6 rounded-2xl shadow-xl text-white`}
              >
                <motion.div 
                  className="text-5xl mb-4"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    y: [0, -5, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 3 
                  }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/90">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Login Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-gradient-to-br from-blue-50 to-purple-50"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ scale: 0.9, rotate: -2 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring" }}
            className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl border-t-4 border-purple-500"
          >
            <motion.h2 
              className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
              initial={{ y: -20 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring" }}
            >
              Welcome Back!
            </motion.h2>
            
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <motion.input
                  whileFocus={{ 
                    scale: 1.02,
                    boxShadow: "0 0 0 2px rgba(124, 58, 237, 0.5)"
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <motion.input
                  whileFocus={{ 
                    scale: 1.02,
                    boxShadow: "0 0 0 2px rgba(124, 58, 237, 0.5)"
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col space-y-4">
                <motion.button
                  whileHover={{ 
                    scale: 1.03,
                    background: "linear-gradient(45deg, #a855f7, #6366f1)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-lg"
                  type="button"
                >
                  Sign In
                </motion.button>
                
                <motion.button
                  whileHover={{ 
                    scale: 1.03,
                    backgroundColor: "rgba(255,255,255,0.9)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="w-full py-3 rounded-lg bg-white text-purple-600 font-bold border border-purple-600 shadow-lg"
                  type="button"
                >
                  Register
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-purple-900 to-blue-900 text-white"
      >
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring" }}
            >
              <motion.h3 
                className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-400"
                animate={{
                  scale: [1, 1.05, 1],
                  textShadow: ["0 0 0px #fff", "0 0 10px #fff", "0 0 0px #fff"]
                }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                HealthCare HIMS
              </motion.h3>
              <p className="text-white/80 mb-4">Transforming healthcare through innovative technology solutions.</p>
              <div className="flex space-x-4">
                {['📱', '💻', '📧', '📞'].map((icon, i) => (
                  <motion.a
                    key={i}
                    whileHover={{ 
                      scale: 1.2,
                      y: -5,
                      rotate: [0, -10, 10, 0]
                    }}
                    whileTap={{ scale: 0.9 }}
                    href="#"
                    className="text-2xl text-white/70 hover:text-white transition"
                  >
                    {icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
            
            {['Quick Links', 'Services', 'Resources'].map((title, i) => (
              <motion.div
                key={i}
                initial={{ x: -20 }}
                whileInView={{ x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-bold mb-4">{title}</h3>
                <ul className="space-y-2">
                  {Array(4).fill().map((_, j) => (
                    <motion.li 
                      key={j}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring" }}
                    >
                      <a href="#" className="text-white/70 hover:text-white transition">
                        {title} Item {j+1}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border-t border-white/20 mt-8 pt-8 text-center text-white/70"
          >
            <motion.p
              animate={{
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              &copy; 2025 HealthCare HIMS. All rights reserved.
            </motion.p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;