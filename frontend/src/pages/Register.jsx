import { useState } from "react";
import { registerUser } from "../api/api";

function Register() {
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("file", image);

        const result = await registerUser(formData);
        setMessage(result.message || "User registered successfully!");
    };

    return (
        <div className="container">
            <h2>Register User</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    required
                />

                <button type="submit">Register</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}

export default Register;
