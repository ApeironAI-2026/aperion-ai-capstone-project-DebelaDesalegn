import { useState } from "react";
import FileUpload from "../components/FileUpload";
import { registerUser } from "../api/api";

function Register() {
    const [name, setName] = useState("");
    const [images, setImages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (images.length === 0) return;

        setLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("name", name);
        for (const image of images) {
            formData.append("files", image);
        }

        try {
            const result = await registerUser(formData);
            setMessage(
                result.message ||
                    (result.status === "success"
                        ? "User registered successfully!"
                        : result.detail || result.error || "Registration failed")
            );
            if (result.status === "success") {
                setImages([]);
                setName("");
            }
        } catch {
            setMessage("Network error — is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Register User</h2>
            <p>Add 1–5 photos for better recognition accuracy.</p>

            <form className="form" onSubmit={handleSubmit}>
                <label className="form-label">
                    Name
                    <input
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>

                <label className="form-label">
                    Photos
                    <FileUpload
                        label="Choose photos"
                        multiple
                        maxFiles={5}
                        files={images}
                        onChange={setImages}
                        disabled={loading}
                    />
                </label>

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading || images.length === 0 || !name.trim()}
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>

            {message && <p className="form-message">{message}</p>}
        </div>
    );
}

export default Register;
