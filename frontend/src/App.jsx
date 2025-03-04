import React from 'react'
import {Routes, Route} from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import UserLogin from './pages/UserLogin'

const App = () => {
  return (
    <Routes>
        <Route path='/' element={<AdminLogin/>} />       
        <Route path='/user' element={<UserLogin/>} />
        {/*
        <Route path='' element={} />
        <Route path='' element={} />
        <Route path='' element={} />
        <Route path='' element={} />
        */}
    </Routes>
  )
}

export default App