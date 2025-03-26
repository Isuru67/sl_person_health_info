import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditHospital = () => {
  const [hospitalId, setHospitalId] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { hospitalId: paramHospitalId } = useParams(); // Extract hospitalId from URL

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/hospitaldashboard/${paramHospitalId}`) // Fetch using hospitalId from URL
      .then((response) => {
        setHospitalId(response.data.hospitalId);
        setHospitalName(response.data.hospitalName);
        setStatus(response.data.status);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert('An error occurred. Please check the console');
        console.error(error);
      });
  }, [paramHospitalId]);

  const handleEditHospital = () => {
    const data = { status }; // Only updating the status field

    setLoading(true);
    axios
      .put(`http://localhost:5555/hospitaldashboard/${hospitalId}`, data) // Use hospitalId from state
      .then(() => {
        setLoading(false);
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        alert('An error occurred. Please check the console');
        console.error(error);
      });
  };

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Edit Hospital Status</h1>
      {loading && <Spinner />}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Hospital ID</label>
          <input
            type='text'
            value={hospitalId}
            disabled
            className='border-2 border-gray-500 px-4 py-2 w-full bg-gray-200 cursor-not-allowed'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Hospital Name</label>
          <input
            type='text'
            value={hospitalName}
            disabled
            className='border-2 border-gray-500 px-4 py-2 w-full bg-gray-200 cursor-not-allowed'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          >
            <option value='pending'>Pending</option>
            <option value='approved'>Approved</option>
            <option value='rejected'>Rejected</option>
          </select>
        </div>
        <button className='p-2 bg-sky-300 m-8' onClick={handleEditHospital}>
          Save Changes
        </button>
        <button className='p-2 bg-gray-300 m-8' onClick={() => navigate('/admin-dashboard')}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditHospital;
