import React , { useState }  from 'react'
import {Routes, Route} from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import UserLogin from './pages/UserLogin'
import Home from './pages/Home'
import HospitalDashboard from './pages/HospitalDashboard'
import PatientRegister from './pages/PatientRegister'
import ViewPatientProfile from './pages/ViewPatientProfile'
import EditPatientProfile from './pages/EditPatientProfile'
import DeletePatientProfile from './pages/DeletePatientProfile'
import H_PatientDetails from './pages/H_PatientDetails'
import Ho_AdmissionDetails from './pages/Ho_AdmissionDetails'
import MedicalHistory from './pages/MedicalHistory'
import TreatmentPlan from './pages/TreatmentPlan'
import ViewTreatment from './pages/ViewTreatment'
import Innovate from './pages/Innovate';


const App = () => {
  const [formData, setFormData] = useState({
    patient: {
        name: "",
        nic: "",
        dob: "",
        blood: "",
        tele: "",
        email: ""
    },
    ho_admissionDetails: {
        admissionDate: "",
        admittingPhysician: "",
        primaryDiagnosis: ""
    },
    medicalHistory: {
        allergies: [],
        illnesses: [],
        medications: [],
        surgeries: [],
        su_imaging: [],
        immunizations: []
    },
    treatmentPlan: {
        medications: [],
        labTests: [],
        te_imaging: [],
        therapies: []
    }
});

  return (
    <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/admin' element={<AdminLogin/>} />       
        <Route path='/user' element={<UserLogin/>} />
        <Route path='/hospitaldashboard' element={<HospitalDashboard />} />
        <Route path='/patient/register' element={<PatientRegister/>}/>
        <Route path='/patient/view/:id' element={<ViewPatientProfile/>}/>
        <Route path='/patient/Edit/:id' element={<EditPatientProfile/>}/>
        <Route path='/patient/Delete/:id' element={<DeletePatientProfile/>}/>
        <Route path='/h-patientdetails' element={<H_PatientDetails formData={formData} setFormData={setFormData} />} />
        <Route path='/h-patientdetails/ho-admission/:nic' element={<Ho_AdmissionDetails formData={formData} setFormData={setFormData} />} />
        <Route path='/h-patientdetails/medical-history/:nic' element={<MedicalHistory formData={formData} setFormData={setFormData} />} />
        <Route path='/h-patientdetails/treatment-plan/:nic' element={<TreatmentPlan formData={formData} setFormData={setFormData} />} />
        <Route path='/h-patientdetails/view/:nic' element={<ViewTreatment formData={formData} setFormData={setFormData} />} />
         <Route path='/innov' element={<Innovate/>} /> 
        {/*
        <Route path='' element={} />
        <Route path='' element={} />
        <Route path='' element={} />
        <Route path='' element={} />
        <Route path='' element={} />
        <Route path='' element={} />
        <Route path='' element={} />
        <Route path='' element={} />
        <Route path='' element={} />

        */}
    </Routes>
  )
}

export default App