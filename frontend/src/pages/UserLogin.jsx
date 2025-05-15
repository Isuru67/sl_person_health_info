import React from 'react'

const UserLogin = () => {
  // Modify the login success handler to store the password
  const handleLoginSuccess = (userData, token) => {
    // Store user information in localStorage INCLUDING the password for decryption
    localStorage.setItem('userInfo', JSON.stringify({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      nic: userData.nic,
      password: form.password, // Save unencrypted password for decryption
      role: userData.role,
      pic: userData.pic
    }));
    localStorage.setItem('token', token);
    
    // Navigate to patient profile
    navigate(`/patient/view/${userData._id}`);
  };

  return (
    <div>UserLogin</div>
  )
}

export default UserLogin