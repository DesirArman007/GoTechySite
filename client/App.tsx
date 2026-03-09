import React from 'react';
import { Home } from './pages/Home';
import { Store } from './pages/Store'; // Import Store
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Team } from './pages/Team';
import { About } from './pages/About';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/team" element={<Team />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

      </BrowserRouter >
    </>
  );
}

export default App;
