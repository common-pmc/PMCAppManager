import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';
import UploadPage from './pages/Upload';

import './App.css';

function App () {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/register"
          element={
            <ProtectedRoute requiredAdmin={true}>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute requiredAdmin={true}>
              <UploadPage />
            </ProtectedRoute>
          }
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredAdmin={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
