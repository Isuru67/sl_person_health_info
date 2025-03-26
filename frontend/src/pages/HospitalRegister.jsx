import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Bell } from 'lucide-react';


const HospitalRegister = () => {

  const navigate = useNavigate();

  

  const [hospitalName, setHospitalName] = useState('');

  const [email, setEmail] = useState('');

  const [mobile1, setMobile1] = useState('');

  const [mobile2, setMobile2] = useState('');

  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const [activeNav, setActiveNav] = useState('Register');



  const navItems = ['Home', 'Features', 'Pricing', 'About Us', 'Contact'];



  const handleFileChange = (e) => {

    if (e.target.files && e.target.files[0]) {

      setImage(e.target.files[0]);

    }

  };



  const handleSaveHospital = () => {

    if (password !== confirmPassword) {

      alert('Passwords do not match!');

      return;

    }



    const formData = new FormData();

    formData.append('hospitalName', hospitalName);

    formData.append('email', email);

    formData.append('mobile1', mobile1);

    formData.append('mobile2', mobile2);

    formData.append('password', password);

    if (image) {

      formData.append('image', image);

    }

    

    setLoading(true);

    axios

      .post('http://localhost:5555/hospitaldashboard/hospital/register', formData, {

        headers: { 'Content-Type': 'multipart/form-data' }

      })

      .then(() => {

        setLoading(false);

        navigate('/');

      })

      .catch((error) => {

        setLoading(false);

        alert('An error occurred. Please check the console');

        console.log(error);

      });

  };



  return (

    <div className="flex flex-col min-h-screen bg-gray-50">

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

              <motion.span

                initial={{ scale: 0 }}

                animate={{ scale: 1 }}

                transition={{ delay: 0.2, type: "spring" }}

                className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-400"

              >

                HealthCare HIMS

              </motion.span>

            </motion.div>

            

            <nav className="hidden md:flex space-x-2 items-center">

              {navItems.map((item) => (

                <motion.div

                  key={item}

                  whileHover={{ scale: 1.05 }}

                  whileTap={{ scale: 0.95 }}

                  onClick={() => setActiveNav(item)}

                  className={`px-4 py-2 rounded-full cursor-pointer ${activeNav === item ?

                    'bg-white text-purple-600 font-bold' :

                    'text-white hover:bg-white/20'}`}

                >

                  {item}

                </motion.div>

              ))}

              

              <div className="flex items-center space-x-4 ml-4">

                <motion.div

                  whileHover={{ scale: 1.2 }}

                  whileTap={{ scale: 0.9 }}

                  className="text-white cursor-pointer"

                >

                  <Bell size={20} />

                </motion.div>

                <motion.div

                  whileHover={{ scale: 1.2 }}

                  whileTap={{ scale: 0.9 }}

                  className="text-white cursor-pointer"

                >

                  <User size={20} />

                </motion.div>

              </div>

            </nav>

            

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



      {/* Main Content */}

      <div className="flex-1 pt-20 pb-8 px-4">

        {/* Back Button moved far left with margin adjustments */}

        <div className="absolute left-4 top-24 z-10">

          <BackButton />

        </div>

        

        <div className="max-w-4xl mx-auto">

          <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">

            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">

              <h1 className="text-3xl font-bold text-white">Hospital Registration</h1>

              <p className="text-blue-100 mt-1">

                Register your hospital to join our healthcare network

              </p>

            </div>



            <div className="p-6">

              {loading ? (

                <div className="flex justify-center py-8">

                  <Spinner />

                </div>

              ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>

                    <div className="mb-5">

                      <label className="block text-sm font-medium text-gray-700 mb-1">

                        Hospital Name *

                      </label>

                      <input

                        type="text"

                        value={hospitalName}

                        onChange={(e) => setHospitalName(e.target.value)}

                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                        required

                      />

                    </div>



                    <div className="mb-5">

                      <label className="block text-sm font-medium text-gray-700 mb-1">

                        Email *

                      </label>

                      <input

                        type="email"

                        value={email}

                        onChange={(e) => setEmail(e.target.value)}

                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                        required

                      />

                    </div>



                    <div className="mb-5">

                      <label className="block text-sm font-medium text-gray-700 mb-1">

                        Primary Mobile Number *

                      </label>

                      <input

                        type="tel"

                        value={mobile1}

                        onChange={(e) => setMobile1(e.target.value)}

                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                        required

                      />

                    </div>



                    <div className="mb-5">

                      <label className="block text-sm font-medium text-gray-700 mb-1">

                        Secondary Mobile Number

                      </label>

                      <input

                        type="tel"

                        value={mobile2}

                        onChange={(e) => setMobile2(e.target.value)}

                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                      />

                    </div>

                  </div>



                  <div>

                    <div className="mb-5">

                      <label className="block text-sm font-medium text-gray-700 mb-1">

                        Password *

                      </label>

                      <input

                        type="password"

                        value={password}

                        onChange={(e) => setPassword(e.target.value)}

                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                        required

                      />

                    </div>



                    <div className="mb-5">

                      <label className="block text-sm font-medium text-gray-700 mb-1">

                        Confirm Password *

                      </label>

                      <input

                        type="password"

                        value={confirmPassword}

                        onChange={(e) => setConfirmPassword(e.target.value)}

                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                        required

                      />

                    </div>



                    <div className="mb-5">

                      <label className="block text-sm font-medium text-gray-700 mb-1">

                        Government Registration Certificate *

                      </label>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">

                        <input

                          type="file"

                          accept="image/*"

                          onChange={handleFileChange}

                          className="hidden"

                          id="file-upload"

                        />

                        <label

                          htmlFor="file-upload"

                          className="cursor-pointer flex flex-col items-center justify-center"

                        >

                          <svg

                            className="w-12 h-12 text-gray-400 mb-2"

                            fill="none"

                            stroke="currentColor"

                            viewBox="0 0 24 24"

                          >

                            <path

                              strokeLinecap="round"

                              strokeLinejoin="round"

                              strokeWidth="2"

                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"

                            />

                          </svg>

                          <span className="text-sm text-gray-600">

                            {image ? image.name : 'Click to upload certificate'}

                          </span>

                        </label>

                      </div>

                      {image && (

                        <p className="mt-2 text-sm text-gray-500">

                          Selected: {image.name}

                        </p>

                      )}

                    </div>



                    <button

                      onClick={handleSaveHospital}

                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"

                    >

                      Register Hospital

                    </button>

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};



export default HospitalRegister;