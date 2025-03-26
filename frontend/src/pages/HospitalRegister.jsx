import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Create Hospital Account</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Hospital Name</label>
          <input 
            type='text'
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Email</label>
          <input 
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Mobile Number 1</label>
          <input 
            type='text'
            value={mobile1}
            onChange={(e) => setMobile1(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Mobile Number 2</label>
          <input 
            type='text'
            value={mobile2}
            onChange={(e) => setMobile2(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Password</label>
          <input 
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Confirm Password</label>
          <input 
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Upload Government Register Certificate Copy</label>
          <input 
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
          {image && <p className="mt-2 text-sm text-gray-500">Selected file: {image.name}</p>}
        </div>
        <button className='p-2 bg-sky-300 m-8' onClick={handleSaveHospital}>
          Create Account
        </button>
      </div>
    </div>
  );
};

export default HospitalRegister;