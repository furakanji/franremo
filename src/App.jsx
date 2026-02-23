import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ArtistProvider } from './context/ArtistContext';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ClassificaPage from './pages/ClassificaPage';
import ArtistDetail from './pages/ArtistDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Seeder from './Seeder';

function AppLayout() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/classifica" element={<ClassificaPage />} />
          <Route path="/artista/:id" element={<ArtistDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/test-seed" element={<Seeder />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ArtistProvider>
      <Router>
        <AppLayout />
      </Router>
    </ArtistProvider>
  );
}
