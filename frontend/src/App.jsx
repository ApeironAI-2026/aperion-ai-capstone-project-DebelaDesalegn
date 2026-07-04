import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Recognize from "./pages/Recognize";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

function App() {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/">Register</Link>
                <Link to="/recognize">Recognize</Link>
                <Link to="/dashboard">Dashboard</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/recognize" element={<Recognize />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile/:userId" element={<Profile />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
