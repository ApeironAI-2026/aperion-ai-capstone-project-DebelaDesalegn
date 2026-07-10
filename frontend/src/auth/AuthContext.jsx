import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { fetchAuthStatus, loginAdmin, fetchAuthMe } from "../api/api";
import {
    clearAuth,
    getStoredToken,
    getStoredUsername,
    storeAuth,
} from "./storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [authRequired, setAuthRequired] = useState(false);
    const [loginEnabled, setLoginEnabled] = useState(false);
    const [token, setToken] = useState(() => getStoredToken());
    const [username, setUsername] = useState(() => getStoredUsername());
    const [loading, setLoading] = useState(true);

    const isAuthenticated = Boolean(token) || !authRequired;

    const refreshStatus = useCallback(async () => {
        try {
            const status = await fetchAuthStatus();
            setAuthRequired(Boolean(status.auth_required));
            setLoginEnabled(Boolean(status.login_enabled));

            const stored = getStoredToken();
            if (status.auth_required && stored) {
                try {
                    const me = await fetchAuthMe();
                    setToken(stored);
                    setUsername(me.username || getStoredUsername() || "admin");
                } catch {
                    clearAuth();
                    setToken("");
                    setUsername("");
                }
            }
        } catch {
            setAuthRequired(false);
            setLoginEnabled(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshStatus();
    }, [refreshStatus]);

    const login = async (user, password) => {
        const data = await loginAdmin(user, password);
        storeAuth(data.access_token, data.username);
        setToken(data.access_token);
        setUsername(data.username);
        setAuthRequired(true);
        setLoginEnabled(true);
        return data;
    };

    const logout = () => {
        clearAuth();
        setToken("");
        setUsername("");
    };

    return (
        <AuthContext.Provider
            value={{
                authRequired,
                loginEnabled,
                isAuthenticated,
                token,
                username,
                loading,
                login,
                logout,
                refreshStatus,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}
