import { authHeaders } from "../auth/storage";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

async function parseJson(response) {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const detail = data.detail || "Request failed.";
        throw new Error(
            Array.isArray(detail)
                ? detail.map((item) => item.msg || String(item)).join(", ")
                : detail,
        );
    }
    return data;
}

export const registerUser = async (formData) => {
    const response = await fetch(`${API_BASE}/register/register`, {
        method: "POST",
        headers: {
            ...authHeaders(),
        },
        body: formData,
    });
    return parseJson(response);
};

export const fetchUsers = async () => {
    const response = await fetch(`${API_BASE}/users/`, {
        headers: authHeaders(),
    });
    return parseJson(response);
};

export const recognizeUser = async (formData, logAttendance = false) => {
    const url = new URL(`${API_BASE}/recognize/`);
    if (logAttendance) {
        url.searchParams.set("log", "true");
    }
    const response = await fetch(url, {
        method: "POST",
        body: formData,
    });
    return parseJson(response);
};

export const markAttendance = async (formData) => {
    const response = await fetch(`${API_BASE}/attendance/`, {
        method: "POST",
        body: formData,
    });
    return parseJson(response);
};

export const fetchAttendance = async () => {
    const response = await fetch(`${API_BASE}/attendance/all`, {
        headers: authHeaders(),
    });
    return parseJson(response);
};

export const fetchAnalytics = async () => {
    const response = await fetch(`${API_BASE}/attendance/analytics/`, {
        headers: authHeaders(),
    });
    return parseJson(response);
};

export const fetchUserProfile = async (userId) => {
    const response = await fetch(`${API_BASE}/users/profile/${userId}`, {
        headers: authHeaders(),
    });
    if (response.status === 404) {
        return null;
    }
    return parseJson(response);
};

export const chatWithAssistant = async (message) => {
    const response = await fetch(`${API_BASE}/assistant/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
        },
        body: JSON.stringify({ message }),
    });

    return parseJson(response);
};

export { API_BASE };
export {
    fetchAuthStatus,
    loginAdmin,
    fetchAuthMe,
} from "./authApi";
