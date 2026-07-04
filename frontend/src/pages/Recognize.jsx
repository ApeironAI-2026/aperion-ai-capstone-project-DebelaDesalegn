import { useState } from "react";
import FileUpload from "../components/FileUpload";
import { markAttendance, recognizeUser } from "../api/api";

function Recognize() {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState("");
    const [mode, setMode] = useState("recognize");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) return;

        setLoading(true);
        setResult("");

        const formData = new FormData();
        formData.append("file", image);

        try {
            const response =
                mode === "attendance"
                    ? await markAttendance(formData)
                    : await recognizeUser(formData, false);

            if (response.status === "success") {
                const confidence =
                    response.confidence?.toFixed?.(2) ?? response.confidence;
                const suffix = response.duplicate
                    ? " (already checked in today)"
                    : response.attendance_logged
                      ? " — attendance logged"
                      : "";
                setResult(`${response.name} (confidence: ${confidence})${suffix}`);
            } else {
                setResult(response.message || response.detail || "No match found");
            }
        } catch {
            setResult("Network error — is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>Recognize / Check In</h2>

            <div className="mode-toggle">
                <label>
                    <input
                        type="radio"
                        value="recognize"
                        checked={mode === "recognize"}
                        onChange={() => setMode("recognize")}
                    />
                    Recognize only
                </label>
                <label>
                    <input
                        type="radio"
                        value="attendance"
                        checked={mode === "attendance"}
                        onChange={() => setMode("attendance")}
                    />
                    Mark attendance
                </label>
            </div>

            <form className="form" onSubmit={handleSubmit}>
                <label className="form-label">
                    Photo
                    <FileUpload
                        label="Choose photo"
                        files={image ? [image] : []}
                        onChange={(file) => setImage(file)}
                        disabled={loading}
                    />
                </label>

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading || !image}
                >
                    {loading
                        ? "Processing..."
                        : mode === "attendance"
                          ? "Check In"
                          : "Recognize"}
                </button>
            </form>

            {result && <p className="form-message">{result}</p>}
        </div>
    );
}

export default Recognize;
