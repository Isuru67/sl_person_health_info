import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';

const ViewHospital = () => {
  const [patient, setPatient] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/patient/${id}`)
      .then((response) => {
        setPatient(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching patient:', error);
        setLoading(false);
      });
  }, [id]);

  const handleEditPatient = () => {
    navigate(`/edit-patient/${id}`);
  };

  const handleDeletePatient = () => {
    axios
      .delete(`http://localhost:5555/patient/${id}`)
      .then(() => {
        alert('Patient profile deleted successfully');
        navigate('/');
      })
      .catch((error) => {
        console.error('Error deleting patient:', error);
      });
  };

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4">View Patient Profile</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4">
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Name:</span>
            <span>{patient.name}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">NIC:</span>
            <span>{patient.nic}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">DOB:</span>
            <span>{patient.dob ? new Date(patient.dob).toDateString() : 'N/A'}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Blood Group:</span>
            <span>{patient.blood}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Telephone:</span>
            <span>{patient.tele}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Email:</span>
            <span>{patient.email}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Profile Picture:</span>
            {patient.pic ? (
              <img
                src={patient.pic}
                alt="Profile"
                className="w-32 h-32 rounded-full border-2 border-gray-300"
              />
            ) : (
              <span>No Picture Available</span>
            )}
          </div>

          <button className="p-2 bg-sky-300 m-8" onClick={handleEditPatient}>
            Edit Profile
          </button>
          <button className="p-2 bg-red-300 m-8" onClick={handleDeletePatient}>
            Delete Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewHospital;

