import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader/PageHeader";
import { fetchUserProfile } from "../api/api";
import "./Profile.css";

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

    if (loading) {
        return (
            <div className="container">
                <p>Loading profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="container">
                <p>User not found.</p>
            </div>
        );
    }

    const initials = profile.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    return (
        <div className="container">
            <PageHeader
                icon="👤"
                title="Student Profile"
                subtitle="View registration details and attendance history."
            />

            <Link className="back-link" to="/dashboard">
                ← Back to Dashboard
            </Link>

            <div className="profile-card">

                <div className="profile-avatar">
                    {initials}
                </div>

                <h2>{profile.name}</h2>

                <span className="profile-badge">
                    Registered Student
                </span>

                <div className="profile-stats">

                    <div className="profile-stat">
                        <h3>{profile.total_entries}</h3>
                        <p>Total Attendance</p>
                    </div>

                    <div className="profile-stat">
                        <h3>
                            {profile.average_confidence.toFixed(2)}%
                        </h3>
                        <p>Average Confidence</p>
                    </div>

                </div>

            </div>

            <div className="profile-section">

                <h3>Recent Attendance</h3>

                {profile.latest_checkins.length === 0 ? (
                    <div className="empty-state">
                        No attendance records yet.
                    </div>
                ) : (
                    <table className="profile-table">
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                <th>Confidence</th>
                            </tr>
                        </thead>

                        <tbody>
                            {profile.latest_checkins.map((entry, index) => (
                                <tr key={index}>
                                    <td>{entry.timestamp}</td>

                                    <td>
                                        {entry.confidence.toFixed(2)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

            </div>

        </div>
    );
}

export default Profile;