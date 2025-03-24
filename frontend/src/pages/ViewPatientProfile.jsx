import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';

const ViewPatientProfile = () => {
  const [patient, setPatient] = useState({});
  const [loading, setLoading] = useState(false);
  const {id} = useParams();

  useEffect(() => {
    setLoading(true);
    axios
    .get(`http://localhost:5555/patient/${id}`)
    .then((response) => {
        setPatient(response.data);
        setLoading(false)
    })
    .catch((error) => {
        console.log(error);
        setLoading(false);
    });
  }, [])

  return (
    <div className='p-4'>
        <BackButton />
        <h1 className='text-3xl my-4'>ViewPatientProfile</h1>
        {loading ? (
            <Spinner />
        ) : (
           <div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4'>
            <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Name</span>
                <span>{patient.name}</span>
            </div>
            <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>NIC</span>
                <span>{patient.nic}</span>
            </div>
            <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>DOB</span>
                <span>{patient.dob}</span>
                <span>{new Date(patient.dob).toString()}</span>
            </div>
            <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Blood Group</span>
                <span>{patient.blood}</span>
            </div>
            <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Telephone</span>
                <span>{patient.tele}</span>
            </div>
            <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Email</span>
                <span>{patient.email}</span>
            </div>
            <div className='my-4'>
                <span className='text-xl mr-4 text-gray-500'>Profile Picture</span>
                <span>{patient.pic}</span>
            </div>
           </div> 
        )}
    </div>
  )
}

export default ViewPatientProfile
