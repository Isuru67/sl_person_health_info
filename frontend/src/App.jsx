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
import Summ_Submission from './pages/Summ_Submission'
import Innovate from './pages/Innovate';


const App = () => {
  const [formData, setFormData] = useState({
    
    ho_admissionDetai: {}, 
    medicalHistory: {}, 
    treatmentPlan: {}
});

  return (
    <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/admin' element={<AdminLogin/>} />       
        <Route path='/user' element={<UserLogin/>} />
        <Route path='/hospitaldashboard' element={<HospitalDashboard formData={formData} setFormData={setFormData} />} />
        <Route path='/patient/create' element={<PatientRegister/>}/>
        <Route path='/patient/view/:id' element={<ViewPatientProfile/>}/>
        <Route path='/patient/Edit/:id' element={<EditPatientProfile/>}/>
        <Route path='/patient/Delete/:id' element={<DeletePatientProfile/>}/>
        <Route path='/hospital-patien' element={<H_PatientDetails formData={formData} setFormData={setFormData} />} />
        <Route path='/Ho-admtission' element={<Ho_AdmissionDetails formData={formData} setFormData={setFormData} />} />
        <Route path='/medical-history' element={<MedicalHistory formData={formData} setFormData={setFormData} />} />
        <Route path='/treatment-plan' element={<TreatmentPlan formData={formData} setFormData={setFormData} />} />
         <Route path='/summ-submission' element={<Summ_Submission formData={formData} />} />
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