const TOKEN_KEY = "face_attendance_admin_token";
const USER_KEY = "face_attendance_admin_user";

export function getStoredToken() {
    return localStorage.getItem(TOKEN_KEY) || "";
}

export function getStoredUsername() {
    return localStorage.getItem(USER_KEY) || "";
}

export function storeAuth(token, username) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, username || "admin");
}

export function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function authHeaders() {
    const token = getStoredToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}
