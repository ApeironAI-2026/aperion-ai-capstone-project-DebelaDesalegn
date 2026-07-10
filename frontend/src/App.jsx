import "./App.css";
import "./pages/Login.css";
import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";

import Register from "./pages/Register";
import Recognize from "./pages/Recognize";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Assistant from "./pages/Assistant";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

function AppShell() {
    const { authRequired, isAuthenticated, username, logout, loading } =
        useAuth();

    return (
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
                    {(!authRequired || isAuthenticated) && (
                        <>
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
                                to="/dashboard"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                }
                            >
                                Dashboard
                            </NavLink>

                            <NavLink
                                to="/assistant"
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                }
                            >
                                Assistant
                            </NavLink>
                        </>
                    )}

                    <NavLink
                        to="/recognize"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        Recognize
                    </NavLink>

                    {!loading && authRequired && (
                        <div className="nav-auth">
                            {isAuthenticated ? (
                                <>
                                    <span className="nav-user">{username}</span>
                                    <button
                                        type="button"
                                        className="logout-btn"
                                        onClick={logout}
                                    >
                                        Log out
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="login-nav-btn">
                                    Admin login
                                </Link>
                            )}
                        </div>
                    )}
                </nav>
            </header>

            <main className="page-content">
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/recognize"
                        element={<Recognize />}
                    />

                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Register />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile/:userId"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/assistant"
                        element={
                            <ProtectedRoute>
                                <Assistant />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppShell />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
