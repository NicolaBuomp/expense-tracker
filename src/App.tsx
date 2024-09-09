// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import InvitePartner from './pages/InvitePartner';
import ReceivedInvites from './pages/ReceivedInvites';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rotta protetta per il Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/invite-partner" element={
          <ProtectedRoute>
            <InvitePartner />
          </ProtectedRoute>
        } />
        <Route path="/received-invites" element={
          <ProtectedRoute>
            <ReceivedInvites />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;
