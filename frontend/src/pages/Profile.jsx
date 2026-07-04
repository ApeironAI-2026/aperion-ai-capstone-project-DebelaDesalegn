import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Profile() {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_BASE = "http://127.0.0.1:8000";

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch(`${API_BASE}/user/profile/${userId}`);
                const data = await response.json();
                setProfile(data);
            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [userId]);

    if (loading) return <p>Loading profile...</p>;
    if (!profile) return <p>User not found.</p>;

    return (
        <div className="container">
            <h2>{profile.name}'s Profile</h2>

            <img
                src={profile.photo_url}
                alt={profile.name}
                style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #ddd",
                    marginBottom: "20px"
                }}
            />

            <h3>Attendance Summary</h3>
            <p>Total Entries: {profile.total_entries}</p>
            <p>Average Confidence: {profile.average_confidence.toFixed(2)}</p>

            <h3>Latest Check-ins</h3>
            <ul>
                {profile.latest_checkins.map((entry, index) => (
                    <li key={index}>
                        {entry.timestamp} — Confidence: {entry.confidence.toFixed(2)}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Profile;
