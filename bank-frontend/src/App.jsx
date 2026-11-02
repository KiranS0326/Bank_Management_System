import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import CustomerDashboard from './CustomerDashboard';
import AdminDashboard from './AdminDashboard';

function App() {
    return (
        <Router>
            <Routes>
                {/* Main Landing Page */}
                <Route path="/" element={<Home />} />
                
                {/* Auth & Dashboards */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/customer-dashboard" element={<CustomerDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;