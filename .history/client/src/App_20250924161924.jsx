import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';
import UploadPage from './pages/Upload';
import FileList from './pages/FileList';
import AddCompany from './pages/AddCompany';
import AdminUserDetails from './pages/AdminUserDetails';

import './App.css';

function App () {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin/register"
          element={
            <ProtectedRoute requiredAdmin={true}>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/upload"
          element={
            <ProtectedRoute requiredAdmin={true}>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <ProtectedRoute requiredAdmin={true}>
              <AdminUserDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredAdmin={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/files"
          element={
            <ProtectedRoute requiredAdmin={true}>
              <FileList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies/new"
          element={
            <ProtectedRoute requiredAdmin={true}>
              <AddCompany />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
