import {Navigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const ProtectedRoute = ({children, requiredAdmin = false}) => {
  const token = localStorage.getItem ('token');
  if (!token) return <Navigate to="/" />;

  let payload;
  try {
    payload = jwtDecode (token);
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
