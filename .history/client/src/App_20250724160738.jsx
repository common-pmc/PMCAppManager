import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

import './App.css';

function App () {
  return (
    <React.Fragment>
      <Login />
    </React.Fragment>
  );
}

export default App;
