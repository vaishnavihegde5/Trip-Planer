import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Wizard from './Wizard';
import Itinerary from './Itinerary';
import Login from './Login';
import Dashboard from './Dashboard';
import Home from './Home';

function App() {
  return (
    <>
      <div className="sky-background"></div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/plan" element={<Wizard />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
