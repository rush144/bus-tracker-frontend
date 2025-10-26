import './App.css';
import { Register } from './pages/RegisterPage/registerPage';
import { Login } from './pages/LoginPage/LoginPage';
import { Dashboard } from './pages/Dashboard/Dashboard'; // Optional if you have a dashboard
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from 'react-router-dom';
import BusMap from './components/BusMap/BusMap';
import { GlobalChat } from './components/GlobalChat/GlobalChat';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Example of protected route (optional) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    </Router>
  );
}

export default App;
