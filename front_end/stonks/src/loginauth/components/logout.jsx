import React from 'react';
import axios from 'axios'; // Make sure you import axios
import { useNavigate } from 'react-router-dom'; // Make sure you import useNavigate

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get('http://localhost:5000/api/fetchuser');
      const users = response.data;

      if (response.status === 200) {
        let foundUser = null;

        
        for (let i = 0; i < localStorage.length; i++) {
          let key = localStorage.key(i);
          let value = localStorage.getItem(key);

          users.forEach((user) => {
            if (value === user._id) { 
              foundUser = user;
              console.log('User found:', foundUser);

              // Remove the key from localStorage and navigate to login
              localStorage.removeItem(key);
              navigate('/login');
            }
          });
        }

        if (!foundUser) {
          alert('User not found in localStorage.');
        }
      } else {
        alert('Could not fetch user.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Could not process the logout request.');
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button> 
    </div>
  );
};

export default Logout;
