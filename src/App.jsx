import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AnnouncementBar from './components/AnnouncementBar';
import FloatingBackButton from './components/FloatingBackButton';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <AnnouncementBar />
        <FloatingBackButton />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
