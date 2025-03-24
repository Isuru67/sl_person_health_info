import React, { useState } from 'react'
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientRegister = () => {
  const [name, setName] = useState('');
  const [nic, setNIC] = useState('');
  const [dob , setDOB] = useState('');
  const [blood, setBloodGroup] = useState('');
  const [tele, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pic, SetProfilePicture] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSavePatient = () => {
    const data = {
      name,
      nic,
      dob,
      blood,
      tele,
      email,
      username,
      password,
      pic,
    };
    setLoading(true);
    axios
    .post('http://localhost:5555/patient', data)
    .then(() => {
      setLoading(false);
      Navigate('/');
    })
    .catch((error) => {
      setLoading(false);
      alert('An error happened. Please chack console');
      console.log(error);
    });
  };
  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Create Patient</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Name</label>
          <input 
           type='text'
           value={name}
           onChange={(e) => setName(e.target.value)}
           className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>NIC</label>
          <input 
           type='text'
           value={nic}
           onChange={(e) => setNIC(e.target.value)}
           className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>DOB</label>
          <input 
           type='date'
           value={dob}
           onChange={(e) => setDOB(e.target.value)}
           className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Blood Group</label>
          <input 
           type='text'
           value={blood}
           onChange={(e) => setBloodGroup(e.target.value)}
           className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Telephone</label>
          <input 
           type='Number'
           value={tele}
           onChange={(e) => setTelephone(e.target.value)}
           className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Email</label>
          <input 
           type='text'
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Username</label>
          <input 
           type='text'
           value={username}
           onChange={(e) => setUsername(e.target.value)}
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
          <label className='text-xl mr-4 text-gray-500'>Profile Picture</label>
          <input 
           type='image'
           value={pic}
           onChange={(e) => SetProfilePicture(e.target.value)}
           className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <button className='p-2 bg-sky-300 m-8' onClick={handleSavePatient}>
          Create Acount
        </button>
      </div>
    </div>
  )
}

export default PatientRegister
