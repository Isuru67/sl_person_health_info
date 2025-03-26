import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';

const ViewHospital = () => {
  const [hospital, setHospital] = useState({});
  const [loading, setLoading] = useState(false);
  const { hospitalId } = useParams(); // Use hospitalId from URL params
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/hospitaldashboard/${hospitalId}`)
      .then((response) => {
        setHospital(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching hospital:', error);
        setLoading(false);
      });
  }, [hospitalId]);

  const handleEditHospital = () => {
    navigate(`/edit-hospital/${hospitalId}`);
  };

  const handleDeleteHospital = () => {
    // Show confirmation before deletion
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this hospital profile? This action cannot be undone.'
    );

    if (isConfirmed) {
      axios
        .delete(`http://localhost:5555/hospitaldashboard/${hospitalId}`)
        .then(() => {
          alert('Hospital profile deleted successfully');
          navigate('/admin-dashboard');
        })
        .catch((error) => {
          console.error('Error deleting hospital:', error);
        });
    }
  };

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4">View Hospital Profile</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4">
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Hospital Name:</span>
            <span>{hospital.hospitalName}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Email:</span>
            <span>{hospital.email}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Mobile 1:</span>
            <span>{hospital.mobile1}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Mobile 2:</span>
            <span>{hospital.mobile2}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Status:</span>
            <span>{hospital.status}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Certificate:</span>
            {hospital.certificateImage ? (
              <img
                src={`http://localhost:5555/uploads/${hospital.certificateImage}`}
                alt="Hospital Certificate"
                className="w-32 h-32 rounded-lg border-2 border-gray-300"
              />
            ) : (
              <span>No Certificate Available</span>
            )}
          </div>

          <button className="p-2 bg-sky-300 m-8" onClick={handleEditHospital}>
            Edit Profile
          </button>
          <button className="p-2 bg-red-300 m-8" onClick={handleDeleteHospital}>
            Delete Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewHospital;
