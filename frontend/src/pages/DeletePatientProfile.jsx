import React, { useState } from 'react'
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DeletePatientProfile = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const handleDeletePatient = () => {
    setLoading(true);
    axios
     .delete('http://localhost:5555/patient/${id}')
     .then(() => {
      setLoading(false);
      navigate('/');
    })
    .catch((error) => {
      alert('An error happened. Please chack console');
      console.log(error); 
     });
  };
  return (
    <div className='p-4'>
      <BackButton/>
      <h1 className='text-3xl my-4'>Delete Patient</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
        <h3 className='text-2xl'>Are you sure want to delete this patient?</h3>

        <button 
          className='p-4 bg-red-600 text-white m-8 w-full'
          onClick={handleDeletePatient}
        >
          Yes, Delete it
        </button>
      </div>
    </div>
  )
}

export default DeletePatientProfile
