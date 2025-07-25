import {Navigate} from 'react-router-dom';
import {jwtdecode} from 'jwt-decode';

const ProtectedRoute = ({children, requiredAdmin = false}) => {
  const token = localStorage.getItem ('token');
  if (!token) return <Navigate to="/" />;

  // Decode token to check if user is admin
  let payload;
  try {
    payload = jwtdecode (token);
  } catch (error) {
    console.error ('Token decode error:', error);
    return <Navigate to="/" />;
  }

  if (requiredAdmin && !payload.isAdmin) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
