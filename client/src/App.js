import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Viewer from './pages/Viewer/Viewer';
import Admin from './pages/Admin/Admin';
import SuperAdmin from './pages/SuperAdmin/SuperAdmin';
import Officers from './pages/Officers/Officers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/viewer" element={<Viewer />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/superadmin" element={<SuperAdmin />} />
        <Route path="/officers" element={<Officers />} />
      </Routes>
    </Router>
  );
}

export default App;
