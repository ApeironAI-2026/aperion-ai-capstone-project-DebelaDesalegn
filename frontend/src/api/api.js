const API_BASE = "http://127.0.0.1:8000"; 
// Change this to your cloud backend URL during deployment

export const registerUser = async (formData) => {
    const response = await fetch(`${API_BASE}/register/register`, {
        method: "POST",
        body: formData
    });
    return response.json();
};

export const recognizeUser = async (formData) => {
    const response = await fetch(`${API_BASE}/recognize`, {
        method: "POST",
        body: formData
    });
    return response.json();
};
