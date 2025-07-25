import {navigate} from 'react-router-dom';

const ProtectedRoutes = ({children, requiredAdmin = false}) => {
  return (
    <div>
      <h1>ProtectedRoutes</h1>
    </div>
  );
};

export default ProtectedRoutes;
