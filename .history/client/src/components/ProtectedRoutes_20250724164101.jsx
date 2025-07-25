import {Navigate} from 'react-router-dom';

const ProtectedRoute = ({children, requiredAdmin = false}) => {
  const token = localStorage.getItem ('token');
  if (!token) return <Navigate to="/" />;

  // Decode token to check if user is admin
  const payload = JSON.parse (atob (token.split ('.')[1]));
  if (requiredAdmin && !payload.isAdmin) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
