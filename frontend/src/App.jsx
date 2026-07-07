import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Register from "./pages/Register";
import Recognize from "./pages/Recognize";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <header className="navbar">
                    <div className="logo">
                        <span className="logo-icon">🎓</span>
                        <div>
                            <h1>Face Attendance</h1>
                            <small>Recognition System</small>
                        </div>
                    </div>

                    <nav className="nav-links">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            Register
                        </NavLink>

                        <NavLink
                            to="/recognize"
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            Recognize
                        </NavLink>

                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            Dashboard
                        </NavLink>
                    </nav>
                </header>

                <main className="page-content">
                    <Routes>
                        <Route path="/" element={<Register />} />
                        <Route path="/recognize" element={<Recognize />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile/:userId" element={<Profile />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;