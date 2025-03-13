import React , { useState }  from 'react'
import {Routes, Route} from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import UserLogin from './pages/UserLogin'
import Home from './pages/Home'
import Ho_Pa_Details from './pages/Ho_Pa_Details'
import Ho_AdmissionDetails from './pages/Ho_AdmissionDetails'
import MedicalHistory from './pages/MedicalHistory'
import TreatmentPlan from './pages/TreatmentPlan'
import Summ_Submission from './pages/Summ_Submission'



const App = () => {
  const [formData, setFormData] = useState({
    ho_patientInfo: {}, 
    ho_admissionDetai: {}, 
    medicalHistory: {}, 
    treatmentPlan: {}
});

  return (
    <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/admin' element={<AdminLogin/>} />       
        <Route path='/user' element={<UserLogin/>} />
        <Route path='/hospital-patien' element={<Ho_Pa_Details formData={formData} setFormData={setFormData} />} />
        <Route path='/Ho-admtission' element={<Ho_AdmissionDetails formData={formData} setFormData={setFormData} />} />
        <Route path='/medical-history' element={<MedicalHistory formData={formData} setFormData={setFormData} />} />
        <Route path='/treatment-plan' element={<TreatmentPlan formData={formData} setFormData={setFormData} />} />
         <Route path='/Summ-Submission' element={<Summ_Submission formData={formData} />} />
        {/*
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