import "./Login.css";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader/PageHeader";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
    const { login, isAuthenticated, authRequired, loginEnabled, loading } =
        useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const redirectTo = location.state?.from || "/dashboard";

    if (!loading && (!authRequired || isAuthenticated)) {
        return <Navigate to={redirectTo} replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await login(username.trim(), password);
            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError(err.message || "Login failed.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login-page">
            <PageHeader
                title="Admin Sign In"
                subtitle="Protect registration, dashboard, and assistant tools."
            />

            <div className="form-card login-card">
                {!loginEnabled && (
                    <div className="alert alert-error">
                        Admin login is not configured on the server. Set
                        ADMIN_PASSWORD in the backend environment.
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3>Credentials</h3>

                        <label className="form-label">
                            Username
                            <input
                                type="text"
                                autoComplete="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={!loginEnabled || submitting}
                                required
                            />
                        </label>

                        <label className="form-label" style={{ marginTop: 18 }}>
                            Password
                            <input
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={!loginEnabled || submitting}
                                required
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="primary-btn register-btn"
                        disabled={!loginEnabled || submitting}
                    >
                        {submitting ? "Signing in…" : "Sign in"}
                    </button>
                </form>

                {error && <div className="alert alert-error">{error}</div>}
            </div>
        </div>
    );
}
