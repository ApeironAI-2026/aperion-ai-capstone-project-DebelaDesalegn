import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchUserProfile } from "../api/api";

function Profile() {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchUserProfile(userId);
                setProfile(data);
            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [userId]);

    if (loading) return <p>Loading profile...</p>;
    if (!profile) return <p>User not found.</p>;

    const initials = profile.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="container">
            <p>
                <Link to="/dashboard">← Back to dashboard</Link>
            </p>

            <div
                style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    background: "#4a5568",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    marginBottom: "20px",
                }}
            >
                {initials}
            </div>

            <h2>{profile.name}&apos;s Profile</h2>

            <h3>Attendance Summary</h3>
            <p>Total Entries: {profile.total_entries}</p>
            <p>Average Confidence: {profile.average_confidence.toFixed(2)}</p>

            <h3>Latest Check-ins</h3>
            {profile.latest_checkins.length === 0 ? (
                <p>No check-ins yet.</p>
            ) : (
                <ul>
                    {profile.latest_checkins.map((entry, index) => (
                        <li key={index}>
                            {entry.timestamp} — Confidence:{" "}
                            {entry.confidence.toFixed(2)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Profile;
