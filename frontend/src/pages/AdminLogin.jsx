import React from 'react'

const AdminLogin = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5555/admin/login', {
        username: username,
        password: password,
        role: role
      });

      // Store jwt token values
      localStorage.setItem('token', response.data.token);
      
      // Navigate based on the selected role
      if (role === 'user') {
        navigate('/user');
      } else if (role === 'hospitalAdmin') {
        navigate('/home');
      } else if (role === 'admin') {
        navigate('/admin');
      }
    } catch (error) {
      setError('Invalid username or password');
    }
  };


  return (
    <div>AdminLogin New</div>
  )
}

export default AdminLogin