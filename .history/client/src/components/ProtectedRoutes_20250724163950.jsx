import {navigate} from 'react-router-dom';

const ProtectedRoutes = ({children, requiredAdmin = false}) => {
  const token = localStorage.getItem ('token');
  const isAdmin = localStorage.getItem ('isAdmin') === 'true'; // Assuming you store admin status in localStorage

  if (!token) {
    // Redirect to login if no token
    navigate ('/');
    return null;
  }

  if (requiredAdmin && !isAdmin) {
    // Redirect to unauthorized page or home if not admin
    navigate ('/unauthorized'); // Adjust this route as needed
    return null;
  }

  return children; // Render the protected component
};

export default ProtectedRoutes;
