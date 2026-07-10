import { authHeaders } from "../auth/storage";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

async function parseError(response) {
    let detail = "Request failed.";
    try {
        const data = await response.json();
        detail = data.detail || detail;
        if (Array.isArray(detail)) {
            detail = detail.map((item) => item.msg || String(item)).join(", ");
        }
    } catch {
        /* ignore */
    }
    return detail;
}

export async function fetchAuthStatus() {
    const response = await fetch(`${API_BASE}/auth/status`);
    if (!response.ok) {
        throw new Error("Unable to read auth status.");
    }
    return response.json();
}

export async function loginAdmin(username, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error(await parseError(response));
    }

    return response.json();
}

export async function fetchAuthMe() {
    const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
            ...authHeaders(),
        },
    });

    if (!response.ok) {
        throw new Error(await parseError(response));
    }

    return response.json();
}
