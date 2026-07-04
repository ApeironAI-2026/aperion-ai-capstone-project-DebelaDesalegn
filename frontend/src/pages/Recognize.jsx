import { useState } from "react";
import { recognizeUser } from "../api/api";

function Recognize() {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", image);

        const response = await recognizeUser(formData);
        setResult(response.name || "No match found");
    };

    return (
        <div className="container">
            <h2>Recognize User</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    required
                />

                <button type="submit">Recognize</button>
            </form>

            {result && <p>Result: {result}</p>}
        </div>
    );
}

export default Recognize;
